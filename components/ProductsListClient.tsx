"use client";

import React, { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/types";
import { Search, X, SlidersHorizontal } from "lucide-react";

interface ProductsListClientProps {
  products: Product[];
}

export default function ProductsListClient({ products }: ProductsListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  // Extract unique brands dynamically
  const brands = useMemo(() => {
    const brandSet = new Set(products.map((p) => p.brand).filter(Boolean));
    return ["All", ...Array.from(brandSet)];
  }, [products]);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.capacity?.toLowerCase().includes(query);

        const matchesBrand =
          selectedBrand === "All" ||
          product.brand.toLowerCase() === selectedBrand.toLowerCase();

        return matchesQuery && matchesBrand;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return 0;
      });
  }, [products, searchQuery, selectedBrand, sortBy]);

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200">
        {/* Search Input Box */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by model, brand (e.g. NASCO, Hisense), or capacity..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0066FF] focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort & Brand Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            <span>Sort by:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-[#0066FF] bg-white cursor-pointer"
          >
            <option value="default">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Brand Quick Filter Chips */}
      {brands.length > 2 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedBrand === brand
                  ? "bg-[#0066FF] text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
        <span>
          Showing <strong className="text-slate-800 font-bold">{filteredProducts.length}</strong> of{" "}
          <strong className="text-slate-800 font-bold">{products.length}</strong> fridges
        </span>
        {(searchQuery || selectedBrand !== "All" || sortBy !== "default") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedBrand("All");
              setSortBy("default");
            }}
            className="text-[#0066FF] font-semibold hover:underline cursor-pointer"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Product Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-slate-200 text-center">
          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-[#0066FF] mb-4">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No fridges found</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            We couldn&apos;t find any fridges matching &quot;{searchQuery || selectedBrand}&quot;. Try adjusting your search query or brand filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedBrand("All");
              setSortBy("default");
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0066FF] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition cursor-pointer"
          >
            Clear Search &amp; Filters
          </button>
        </div>
      )}
    </div>
  );
}
