"use client";

import * as React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

const FALLBACK_IMAGE = "/img/res1.webp";

const normalizeGallery = (heroImage, gallery, productName) => {
  const items = [];

  if (heroImage) {
    items.push({
      id: "hero",
      url: heroImage,
      alt: productName ? `${productName} hero image` : "Product image",
    });
  }

  gallery.forEach((item, index) => {
    if (!item) return;
    if (typeof item === "string") {
      items.push({
        id: `gallery-${index}`,
        url: item,
        alt: productName ? `${productName} gallery ${index + 1}` : "Product photo",
      });
    } else if (item.url) {
      items.push({
        id: item.id || `gallery-${index}`,
        url: item.url,
        alt:
          item.alt ||
          (productName
            ? `${productName} gallery ${index + 1}`
            : "Product photo"),
      });
    }
  });

  if (items.length === 0) {
    items.push({
      id: "fallback",
      url: FALLBACK_IMAGE,
      alt: "Product placeholder",
    });
  }

  return items;
};

export default function ImageGallery({ heroImage, gallery = [], productName }) {
  const mediaItems = React.useMemo(
    () => normalizeGallery(heroImage, gallery, productName),
    [heroImage, gallery, productName]
  );

  const [active, setActive] = React.useState(
    mediaItems[0]?.url || FALLBACK_IMAGE
  );

  React.useEffect(() => {
    const nextActive = mediaItems[0]?.url || FALLBACK_IMAGE;
    setActive((prev) => (prev === nextActive ? prev : nextActive));
  }, [mediaItems]);

  return (
    <div className="flex gap-4">
      {/* Asosiy rasm */}
      <div className="relative group">
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-zoom-in relative w-[100px] h-[200px] sm:w-[250px] sm:h-[350px] md:w-[350px] md:h-[450px] rounded-xl overflow-hidden">
              <Image
                src={active}
                alt={mediaItems.find((item) => item.url === active)?.alt || "Product image"}
                fill
                className="object-contain"
              />
            </div>
          </DialogTrigger>
          <DialogContent mark="true" className="max-w-full w-[calc(98vw)] h-[calc(97vh)] bg-black/70 p-0 z-[9999]">
            <DialogHeader>
              <DialogTitle className="hidden" />
              <DialogDescription className="hidden" />
            </DialogHeader>
            <div className="relative w-full h-[600px] bg-black">
              <Image
                src={active}
                alt={mediaItems.find((item) => item.url === active)?.alt || "Product image"}
                fill
                className="object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Thumbnail rasmlar */}
      <div className="flex flex-col justify-center items-center gap-3">
        {mediaItems.map((item) => (
          <div
            key={item.id}
            className={cn(
              "relative w-10 md:w-16 h-10 md:h-16 rounded-md cursor-pointer overflow-hidden",
              active === item.url ? "border bg-primary/10" : ""
            )}
            onClick={() => setActive(item.url)}
          >
            <Image
              src={item.url}
              alt={item.alt}
              fill
              className="object-contain p-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
