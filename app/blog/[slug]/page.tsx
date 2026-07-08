import type { Metadata } from "next";
import Image from "next/image";
import SafeImage from "@/components/common/SafeImage";
import Link from "next/link";
import { Calendar, Tag, Clock } from "lucide-react";
import * as blogsRepo from "@/lib/repositories/blog.repository";
import * as productsRepo from "@/lib/repositories/product.repository";
import { redirect } from "next/navigation";
import { ProductCard, type ProductCardData } from "@/components/ui/ProductCard";
import { StarRating } from "@/components/ui/StarRating";

export const revalidate = 60; // 1 minute revalidate

function getReadTime(html: string): number {
  const words = html.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await blogsRepo.findBySlug(params.slug);

  if (!post) return { title: "Blog Not Found | PunchRaksha" };
  
  return {
    title: post.metaTitle || `${post.title} | PunchRaksha`,
    description: post.metaDescription || post.excerpt,
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${params.slug}`,
      type: "article",
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const post = await blogsRepo.findBySlug(params.slug);

  if (!post) {
    redirect("/blog");
  }

  // Related posts logic
  const relatedPosts = await blogsRepo.findRecentExcluding(post.slug, 3);

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
    : "";
  const category = post.tags && post.tags.length > 0 ? post.tags[0] : "General";
  const readTime = getReadTime(post.content || "");

  // Fetch exclusive offer product (bestselling)
  const productDocs = (await productsRepo.find(
    { inStock: true, isBestSelling: true, isArchived: { $ne: true } },
    { limit: 1 },
  )) as any[];
  let exclusiveProduct: ProductCardData | null = null;
  if (productDocs.length > 0) {
    const p = productDocs[0];
    const firstPack = p.packOptions && p.packOptions.length > 0 ? p.packOptions[0] : null;
    exclusiveProduct = {
      _id: p._id.toString(),
      name: p.name,
      secondaryName: p.secondaryName,
      label: p.label,
      subLabel: p.subLabel,
      slug: p.slug,
      category: p.category || "Piles Medicine",
      image: p.images?.[0]?.url || "/images/placeholders/product-placeholder.svg",
      price: firstPack?.price || p.price,
      mrp: firstPack?.mrp || (p.price + (p.price * p.discountPercent) / 100),
      discountPercent: firstPack?.discountPercent || p.discountPercent,
      rating: p.overallRating || 0,
      reviewCount: p.totalReviews || 0,
      packLabel: firstPack?.label || "PACK OF 1",
      upiDiscountPercent: p.upiDiscountPercent || 10,
      upiMaxDiscount: p.upiMaxDiscount || 60,
      cardDiscountPercent: p.cardDiscountPercent || 5,
      cardMaxDiscount: p.cardMaxDiscount || 25,
    };
  }

  // Fetch suggested products
  let suggestedProducts: ProductCardData[] = [];
  if (post.suggestedProductIds && post.suggestedProductIds.length > 0) {
    const suggestedDocs = (await productsRepo.find({
      _id: { $in: post.suggestedProductIds },
      inStock: true,
      isArchived: { $ne: true },
    })) as any[];

    // Sort to respect selected order
    const sortedDocs = [...suggestedDocs].sort((a, b) => {
      const idxA = post.suggestedProductIds.indexOf(a._id.toString());
      const idxB = post.suggestedProductIds.indexOf(b._id.toString());
      return idxA - idxB;
    });

    suggestedProducts = sortedDocs.map((p) => {
      const firstPack = p.packOptions && p.packOptions.length > 0 ? p.packOptions[0] : null;
      return {
        _id: p._id.toString(),
        name: p.name,
        secondaryName: p.secondaryName,
        label: p.label,
        subLabel: p.subLabel,
        slug: p.slug,
        category: p.category || "Piles Medicine",
        image: p.images?.[0]?.url || "/images/placeholders/product-placeholder.svg",
        price: firstPack?.price || p.price,
        mrp: firstPack?.mrp || (p.price + (p.price * p.discountPercent) / 100),
        discountPercent: firstPack?.discountPercent || p.discountPercent,
        rating: p.overallRating || 0,
        reviewCount: p.totalReviews || 0,
        packLabel: firstPack?.label || "PACK OF 1",
        upiDiscountPercent: p.upiDiscountPercent || 10,
        upiMaxDiscount: p.upiMaxDiscount || 60,
        cardDiscountPercent: p.cardDiscountPercent || 5,
        cardMaxDiscount: p.cardMaxDiscount || 25,
      };
    });
  }

  // Sidebar always uses the same card design — curated suggested products
  // when the post has them, otherwise the bestseller fallback.
  const productsToShow: ProductCardData[] =
    suggestedProducts.length > 0 ? suggestedProducts : exclusiveProduct ? [exclusiveProduct] : [];
  const sidebarHeading = suggestedProducts.length > 0 ? "Suggested Products" : "Buy Piles Medicine";

  return (
    <div className="w-full bg-white">
      <hr />
      <div className="mx-auto max-w-[1920px] px-4 lg:px-[50px] py-[40px] md:py-[70px]">
        {/* Breadcrumb */}
        <nav className="mb-[20px] md:mb-[30px] flex flex-wrap items-center gap-[6px] txt-div-22 font-outfit font-light text-[#121212] tracking-[0.03em] ">
          <Link href="/" className="hover:text-primary font-light text-[#121212] ">Home</Link>
          <span className="font-light text-[#121212]">›</span>
          <Link href="/blog" className="font-light text-[#121212] hover:text-primary ">Blog</Link>
          <span className="font-light text-[#121212]">›</span>
          <span className="text-[#121212] font-medium truncate max-w-[200px] md:max-w-md">{post.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row w-full gap-[30px] lg:gap-[40px] xl:gap-[50px] relative">
          {/* Main Article Content (60%) */}
          <article className="w-full lg:w-[60%] shrink-0 pr-0 xl:pr-[20px]">
            <h1 className="txt-h1 font-semibold text-[#121212] leading-tight mb-[30px]">
              {post.title}
            </h1>

            <div className="relative aspect-[898/472] w-full mb-[60px] overflow-hidden shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
              {post.coverImage ? (
                <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-50" />
              )}
            </div>

            {/* Meta row: date / category / read time */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-b border-gray-200 py-[22px] font-outfit text-[14px] text-[#767676]">
              {formattedDate && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{formattedDate}</span>
                </div>
              )}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Tag size={16} />
                  <span>{category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{readTime} min read</span>
                </div>
              </div>
            </div>

            <div
              className="prose max-w-none font-outfit text-[16px] md:text-[18px] leading-[32px] text-text-main prose-headings:font-bold prose-headings:text-[#121212] prose-a:text-[#0E512D] prose-img:rounded-md mt-[45px]"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Author Section */}
            {post.author && (
              <div className="mt-12">
                <span className="block font-outfit text-[14px] font-semibold uppercase tracking-wider text-[#767676] mb-4">
                  Author
                </span>
                <div className="flex items-center gap-4">
                  <div className="w-[65px] h-[65px] rounded-full bg-[#045830] text-white flex items-center justify-center font-bold text-xl shrink-0">
                    {post.author.charAt(0).toUpperCase()}
                  </div>
                  <h4 className="font-outfit text-[16px] font-bold text-[#121212]">
                    {post.author}
                  </h4>
                </div>
                <p className="font-outfit text-[14px] text-[#767676] leading-relaxed mt-4">
                  Ayurvedic Expert & Medical Advisor at PunchRaksha
                </p>
              </div>
            )}

            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Article",
                  headline: post.title,
                  description: post.excerpt,
                  datePublished: post.publishedAt,
                }),
              }}
            />
          </article>

          {/* Vertical Divider */}
          <div className="hidden lg:block w-[1px] bg-gray-200 shrink-0 self-stretch"></div>

          {/* Right Sidebar (40%) */}
          <aside className="w-full lg:flex-1 shrink-0 h-fit sticky top-[120px] flex flex-col gap-6 pl-0 xl:pl-[10px]">
            {productsToShow.length > 0 && (
              <div className="bg-[#EBF7F2] p-6 lg:p-[35px] flex flex-col items-center w-full">
                <h3 className="font-outfit text-[22px] md:text-[26px] font-semibold text-[#121212] mb-[2px] text-center leading-none">
                  {sidebarHeading}
                </h3>
                <p className="font-outfit text-[14px] md:text-[16px] font-semibold text-[#32B440] mb-[30px] text-center">
                  Get 10% Discount <span className="font-medium text-[#50ae57]">on Prepaid Orders</span>
                </p>

                <div className="w-full max-w-[500px] mx-auto flex flex-col gap-6">
                  {productsToShow.map((product) => (
                    <div key={product._id}>
                      {/* Mobile: the universal, fully-functional product card (real qty/pack/add-to-cart) */}
                      <div className="sm:hidden">
                        <ProductCard product={product} />
                      </div>

                      {/* Tablet/desktop: custom horizontal "Buy Piles Medicine" layout */}
                      <div className="hidden sm:block">
                        <div className="bg-white p-4 shadow-sm w-full mb-6 relative border border-gray-100 flex flex-row gap-4 items-start">
                          {/* Product Image exactly referencing DB to prevent hardcoded custom images */}
                          <div className="relative w-[150px] h-[150px] shrink-0 bg-[#fef4f4] flex items-center justify-center overflow-hidden">
                            <SafeImage src={product.image || "/images/PunchRaksha_Product.png"} alt="Product" fill className="object-cover" />
                          </div>

                          {/* Product details */}
                          <div className="flex flex-col justify-center w-full flex-1">
                            {(product.label || product.subLabel) ? (
                              <>
                                <h4 className="font-outfit text-[18px] md:text-[20px] font-semibold text-[#045830] mb-[4px] leading-tight">
                                  {product.label}
                                </h4>
                                {product.subLabel && (
                                  <p className="font-outfit text-[13px] md:text-[14px] text-[#767676] mb-2 font-medium bg-transparent border-0 !p-0">
                                    {product.subLabel}
                                  </p>
                                )}
                              </>
                            ) : (
                              <>
                                <h4 className="font-outfit text-[18px] md:text-[20px] font-semibold text-[#121212] mb-[4px] leading-tight">
                                  {product.name}
                                </h4>
                                <p className="font-outfit text-[13px] md:text-[14px] text-gray-700 mb-2 font-medium bg-transparent border-0 !p-0">
                                  {product.secondaryName || product.category || "Constipation | Regular Bowel Movements"}
                                </p>
                              </>
                            )}

                            <div className="flex items-center gap-2 mb-2">
                              <StarRating value={product.rating} />
                              <span className="text-[13px] md:text-[14px] text-gray-500 font-outfit font-medium">
                                {product.rating.toFixed(1)} rating | {product.reviewCount} review
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mb-3 mt-1 font-outfit">
                              <span className="text-[25px] font-bold text-[#121212] leading-none">₹{product.price}</span>
                              <span className="text-[16px] text-[#767676] line-through font-semibold leading-none mr-2">₹{product.mrp}</span>
                              <span className="text-[12px] bg-[#045830] text-white px-2 py-1 rounded-[4px] font-semibold tracking-wider">
                                {product.discountPercent}% OFF
                              </span>
                            </div>

                            <div className="relative w-[130px]">
                              <select className="appearance-none border border-gray-400 bg-white rounded-[5px] pl-3 pr-8 py-1.5 w-full text-[13px] font-outfit font-medium focus:outline-none">
                                <option>{product.packLabel || "PACK OF '1'"}</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-[15px] w-full">
                          {/* Qty Selector */}
                          <div className="flex items-center justify-between border border-[#121212] bg-white w-[110px] h-[52px] shrink-0 rounded-[5px]">
                            <button className="w-10 h-full flex items-center justify-center text-[#121212] text-xl hover:bg-gray-50">-</button>
                            <span className="text-[#121212] font-medium font-outfit">1</span>
                            <button className="w-10 h-full flex items-center justify-center text-[#121212] text-xl hover:bg-gray-50">+</button>
                          </div>
                          {/* Add to cart / BUY NOW */}
                          <Link href={`/product/${product.slug}`} className="flex-grow flex items-center justify-center h-[52px] bg-[#045830] text-white font-outfit font-medium text-[16px] rounded-[5px] hover:bg-[#034620] transition-colors">
                            BUY NOW
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Outline Button below Green Box */}
            <Link href="/products" className="flex w-full max-w-[500px] mx-auto items-center justify-center h-[54px] border border-[#045830] text-[#045830] bg-white font-outfit font-bold text-[16px] tracking-wide rounded-[5px] hover:bg-gray-50 transition-colors mt-2">
              BROWSE ALL PRODUCTS
            </Link>
          </aside>
        </div>

        {/* More Practical Articles (Bottom Related Posts) */}
        {relatedPosts.length > 0 && (
          <div className="mt-[100px] pt-[40px] border-t border-gray-100">
            <h2 className="text-center font-outfit text-[32px] font-semibold tracking-[1px] text-text-main mb-[50px]">
              More practical articles
            </h2>
            <div className="grid grid-cols-1 gap-x-[30px] gap-y-[50px] md:grid-cols-2 xl:grid-cols-3">
              {relatedPosts.map((rp) => (
                <Link key={rp.slug} href={`/blog/${rp.slug}`} className="mx-auto block w-full max-w-[590px] group">
                  <div className="relative aspect-[590/310] w-full overflow-hidden shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                    {rp.coverImage && <Image src={rp.coverImage} alt={rp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />}
                  </div>
                  <h3 className="mt-[30px] font-outfit text-[16px] md:text-[20px] 3xl:text-[25px] font-semibold text-[#121212] text-center leading-[22px] md:leading-[28px] 3xl:leading-[35px] tracking-[0.03em] group-hover:text-[#045830] transition-colors">
                    {rp.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
