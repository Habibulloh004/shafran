"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from "@/components/ui/carousel";

const FALLBACK_IMAGE = "/background/creed.webp";

export default function BannerCarousel({ banners = [] }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Agar banner yo'q bo'lsa
  if (banners.length === 0) {
    return (
      <div className="relative w-full h-20 md:h-42 rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5">
        <Image
          src={FALLBACK_IMAGE}
          alt="Banner"
          fill
          priority
          quality={100}
          className="object-cover"
        />
      </div>
    );
  }

  // Bitta banner bo'lsa carousel kerak emas
  if (banners.length === 1) {
    const banner = banners[0];
    const image = mounted
      ? isDark
        ? banner?.image_dark || banner?.image_light || FALLBACK_IMAGE
        : banner?.image_light || banner?.image_dark || FALLBACK_IMAGE
      : banner?.image_light || banner?.image_dark || FALLBACK_IMAGE;

    return (
      <div className="relative w-full h-20 md:h-42 rounded-2xl overflow-hidden">
        {banner.url ? (
          <Link href={banner.url} className="block w-full h-full">
            <Image
              src={image}
              alt={banner.title || "Banner"}
              fill
              priority
              quality={100}
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </Link>
        ) : (
          <Image
            src={image}
            alt={banner.title || "Banner"}
            fill
            priority
            quality={100}
            className="object-cover"
          />
        )}
      </div>
    );
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent gap={4}>
        {banners.map((banner, index) => {
          const image = mounted
            ? isDark
              ? banner?.image_dark || banner?.image_light || FALLBACK_IMAGE
              : banner?.image_light || banner?.image_dark || FALLBACK_IMAGE
            : banner?.image_light || banner?.image_dark || FALLBACK_IMAGE;

          return (
            <CarouselItem key={banner.id || index} gap={4}>
              <div className="relative w-full h-20 md:h-42 rounded-2xl overflow-hidden">
                {banner.url ? (
                  <Link href={banner.url} className="block w-full h-full group">
                    <Image
                      src={image}
                      alt={banner.title || `Banner ${index + 1}`}
                      fill
                      priority={index === 0}
                      quality={100}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1280px"
                    />
                  </Link>
                ) : (
                  <Image
                    src={image}
                    alt={banner.title || `Banner ${index + 1}`}
                    fill
                    priority={index === 0}
                    quality={100}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1280px"
                  />
                )}
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>

      {/* Dots - absolyut pozitsiyada banner ichida */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
        <CarouselDots className="mt-0" />
      </div>
    </Carousel>
  );
}
