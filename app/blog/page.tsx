import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as blogsRepo from "@/lib/repositories/blog.repository";

export const revalidate = 60; // 1 minute revalidate

function getPageNumbers(current: number, total: number): (number | "...")[] {
  const pages = new Set<number>([1, total]);
  for (let p = current - 1; p <= current + 2; p++) {
    if (p >= 1 && p <= total) pages.add(p);
  }
  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: (number | "...")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push("...");
    result.push(p);
  });
  return result;
}

export function generateMetadata(): Metadata {
  return {
    title: "Blog | PunchRaksha",
    description: "Informative health blog by PunchRaksha.",
    alternates: { canonical: "/blog" },
  };
}

export default async function BlogPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || "1", 10) || 1;
  const limit = 6;
  const skip = (page - 1) * limit;

  const total = await blogsRepo.countDocuments();
  const totalPages = Math.ceil(total / limit);

  const posts = await blogsRepo.find({}, { skip, limit });

  return (
    <div className="w-full bg-white">
      <hr />
      <div className="max-w-[1920px] mx-auto px-4 lg:px-[50px] pb-[60px] md:pb-[75px] 3xl:pb-[90px]">
        <h1 className="text-center txt-h1 font-semibold text-[#121212] mt-[30px] mb-[30px] md:mt-[45px] md:mb-[45px] 3xl:mt-[60px]">
          Blog: Practical Advice for Your Health and Wellbeing
        </h1>
        <p className="mx-auto mt-6 max-w-[800px] text-center font-outfit txt-p">
          Welcome to our blog, your go-to resource for all things health and wellness. Whether you&apos;re looking to start a new fitness routine, follow a balanced diet, or learn more about our proven weight loss program, we have everything you need in one place.
        </p>

        <div className="mt-[60px] grid grid-cols-1 gap-x-[30px] gap-y-[40px] md:grid-cols-2 xl:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="mx-auto block w-full max-w-[590px] group">
              <div className="relative aspect-[590/310] w-full overflow-hidden shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                {p.coverImage ? (
                  <Image
                    src={p.coverImage}
                    alt={p.coverImageAlt || p.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <h3 className="mt-[30px] font-outfit text-[16px] md:text-[20px] 3xl:text-[25px] font-semibold text-[#121212] text-center leading-[22px] md:leading-[28px] 3xl:leading-[35px] tracking-[0.03em] group-hover:text-[#045830] transition-colors">
                {p.title}
              </h3>
            </Link>
          ))}
          {posts.length === 0 && (
             <div className="col-span-1 md:col-span-2 xl:col-span-3 text-center py-20 text-gray-500">
                No blog posts available at the moment.
             </div>
          )}
        </div>
        
        {totalPages > 1 && (
          <div className="mt-[60px] flex items-center justify-center gap-[8px] font-outfit">
            {page > 1 && (
              <Link href={`/blog?page=${page - 1}`} aria-label="Previous page" className="flex h-[43px] w-[50px] items-center justify-center text-[#121212]">
                <ChevronLeft size={18} />
              </Link>
            )}

            <div className="flex items-center">
              {getPageNumbers(page, totalPages).map((item, i, arr) =>
                item === "..." ? (
                  <div key={`ellipsis-before-${arr[i + 1]}`} className="flex h-[43px] w-[50px] items-center justify-center gap-1">
                    <span className="h-[7px] w-[7px] rounded-full bg-[#121212]/40" />
                    <span className="h-[7px] w-[7px] rounded-full bg-[#121212]/40" />
                    <span className="h-[7px] w-[7px] rounded-full bg-[#121212]/40" />
                  </div>
                ) : (
                  <Link
                    key={item}
                    href={`/blog?page=${item}`}
                    className={`flex h-[43px] w-[50px] items-center justify-center text-[18px] tracking-[0.05em] transition-colors duration-200 ${
                      item === page
                        ? "bg-[#a4d25e] font-bold text-[#121212]"
                        : "bg-[rgba(164,210,94,0.15)] font-medium text-[#121212]/70 hover:bg-[#a4d25e]/40"
                    }`}
                  >
                    {item}
                  </Link>
                )
              )}
            </div>

            {page < totalPages && (
              <Link href={`/blog?page=${page + 1}`} aria-label="Next page" className="flex h-[43px] w-[50px] items-center justify-center text-[#121212]">
                <ChevronRight size={18} />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
