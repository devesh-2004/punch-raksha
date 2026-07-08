"use client";

import { useState } from "react";
import { ProductCard, type ProductCardData } from "@/components/ui/ProductCard";

const FIRST_PAGE = 8;

export function AllProductsGridClient({ products }: { products: ProductCardData[] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-[12px] md:gap-[20px] w-full">
        {products.map((p, i) =>
          i < FIRST_PAGE ? (
            <ProductCard key={p._id} product={p} />
          ) : (
            <div key={p._id} className={expanded ? "contents" : "hidden md:contents"}>
              <ProductCard product={p} />
            </div>
          ),
        )}
      </div>

      {!expanded && products.length > FIRST_PAGE && (
        <button
          onClick={() => setExpanded(true)}
          className="md:hidden mt-[30px] px-[30px] py-[12px] bg-[#045830] text-white font-outfit txt-p-lg font-semibold rounded-[6px] hover:bg-[#03421f] transition-colors"
        >
          Show More
        </button>
      )}
    </div>
  );
}
