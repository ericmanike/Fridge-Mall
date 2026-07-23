"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ProductImageGallery({
  images,
  alt,
}: ProductImageGalleryProps) {
  // Filter out empty string entries
  const validImages = images.filter((img) => typeof img === "string" && img.trim() !== "");
  const displayImages = validImages.length > 0 ? validImages : ["/fridges/lg-double-door.svg"];

  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeImage = displayImages[selectedIndex] || displayImages[0];

  return (
    <div className="relative flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-sky-50 to-white p-6 shadow-xs border border-slate-100/80 transition-all w-full">
      {/* Main Image Display */}
      <div className="relative w-full h-[320px] sm:h-[380px] flex items-center justify-center overflow-hidden rounded-xl">
        <Image
          src={activeImage}
          alt={`${alt} - Image ${selectedIndex + 1}`}
          width={360}
          height={300}
          priority
          className="object-contain max-h-full max-w-full rounded-xl transition-all duration-300 transform"
        />
      </div>

      {/* Thumbnail indicators at bottom */}
      {displayImages.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          {displayImages.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-14 w-14 rounded-full overflow-hidden border-2 transition-all cursor-pointer bg-white ${
                selectedIndex === idx
                  ? "border-blue-600 ring-2 ring-blue-600/30 scale-105"
                  : "border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400"
              }`}
            >
              <Image
                src={imgUrl}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-contain p-1 rounded-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
