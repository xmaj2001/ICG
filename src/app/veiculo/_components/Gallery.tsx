"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

interface GalleryProps {
  images: string[];
  brand: string;
  badge?: string;
}

export function Gallery({ images, brand, badge }: GalleryProps) {
  const [active, setActive] = useState(0);
  return (
    <>
      {/* Gallery */}
      <div>
        <div
          className={`relative aspect-[16/10] car-gradient-${images[active]} border border-border overflow-hidden`}
        >
          {badge && (
            <span
              className={`absolute top-4 left-4 label-eyebrow px-2.5 py-1 ${badge === "NOVO" ? "bg-gold text-background" : "bg-background/80 text-gold border border-gold/40"}`}
            >
              {badge}
            </span>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={images[active]}
              alt={`Foto ${active + 1}`}
              width={800}
              height={800}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="absolute bottom-4 right-4 label-eyebrow text-muted-foreground bg-background/70 px-2.5 py-1 border border-border">
            {active + 1} / {images.length}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-5 gap-3">
          {images.map((g, i) => (
            <Button
              key={i.toString()}
              onClick={() => setActive(i)}
              className={`aspect-video p-0 w-full h-full border transition-all ${active === i ? "border-gold" : "border-border hover:border-gold/40"}`}
              aria-label={`Foto ${i + 1}`}
            >
              <Image
                src={g}
                alt={`Foto ${i + 1}`}
                width={100}
                height={100}
                className="object-cover w-full h-full"
              />
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}
