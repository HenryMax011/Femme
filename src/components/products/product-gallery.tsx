"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const [origin, setOrigin] = useState("50% 50%");

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-square overflow-hidden rounded-[2rem] border border-border bg-soft"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          setOrigin(`${x}% ${y}%`);
        }}
      >
        <Image
          src={images[active]}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-200 ease-out hover:scale-150"
          style={{ transformOrigin: origin }}
        />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={image + index}
            type="button"
            onClick={() => setActive(index)}
            className={cn(
              "relative aspect-square cursor-pointer overflow-hidden rounded-2xl border transition-all",
              active === index
                ? "border-aqua ring-2 ring-aqua/40"
                : "border-border hover:border-aqua/60",
            )}
          >
            <Image
              src={image}
              alt={`${name} ${index + 1}`}
              fill
              sizes="120px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
