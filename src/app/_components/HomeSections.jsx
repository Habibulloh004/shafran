"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/i18n";

const FALLBACK_PERFUME_IMAGE = "/background/creed.webp";
const FALLBACK_FLOWER_IMAGE = "/background/flower.webp";

const buildCategoryHref = (categoryId, sectionKey) => {
  if (!categoryId) return "#";
  const params = sectionKey ? `?section=${sectionKey}` : "";
  return `/category/${categoryId}${params}`;
};

const pickCategoryImage = (category, sectionKey) =>
  category?.card_image ||
  category?.hero_image_light ||
  category?.hero_image_dark ||
  (sectionKey === "flowers" ? FALLBACK_FLOWER_IMAGE : FALLBACK_PERFUME_IMAGE);

function CategoryCard({ category, sectionKey, index }) {
  const { t } = useTranslation();
  if (!category) return null;

  const href = buildCategoryHref(category.id, sectionKey);
  const isMiddleCard = index % 3 === 1;

  return (
    <Link
      href={href}
      className={`w-full max-w-[120px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[280px] rounded-lg sm:rounded-xl md:rounded-2xl bg-white/60 dark:bg-black/35 flex flex-col justify-center items-center p-2 sm:p-3 md:p-4 ${
        isMiddleCard ? "translate-y-4 sm:translate-y-6 md:translate-y-8 lg:translate-y-10" : ""
      }`}
      prefetch={false}
    >
      <div className="relative w-[80px] h-[60px] sm:w-[120px] sm:h-[90px] md:w-[160px] md:h-[120px] lg:w-[200px] lg:h-[150px] xl:w-[250px] xl:h-[200px]">
        <Image
          src={pickCategoryImage(category, sectionKey)}
          alt={category.name || t("common.category")}
          fill
          priority
          quality={100}
          className="object-contain"
        />
      </div>
      <p className="text-xs sm:text-sm md:text-base text-black/70 dark:text-white/60">
        {category.subtitle || category.description || t("common.collection")}
      </p>
      <h2 className="text-xs sm:text-sm md:text-md font-semibold text-black dark:text-white">
        {category.name || t("common.category")}
      </h2>
    </Link>
  );
}

export function PerfumesSection({ categories, headline, description }) {
  const { t } = useTranslation();

  return (
    <div className="containerCustom flex flex-col justify-center items-center gap-3 sm:gap-5 px-4">
      <h1 className="font-montserrat-alt text-lg sm:text-xl md:text-2xl">
        {headline || t("home.perfumesTitle")}
      </h1>
      <p className="text-sm text-muted-foreground text-center max-w-2xl">
        {description || t("home.perfumesDescription")}
      </p>
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 justify-items-center w-full max-w-4xl">
        {categories.length === 0 ? (
          <p className="col-span-3 text-sm text-muted-foreground text-center">
            {t("home.perfumesEmpty")}
          </p>
        ) : (
          categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              sectionKey="perfumes"
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
}

export function FlowersSection({ categories, headline, description }) {
  const { t } = useTranslation();

  return (
    <div className="pb-10 containerCustom flex flex-col justify-center items-center gap-3 sm:gap-5 px-4">
      <h1 className="font-montserrat-alt text-lg sm:text-xl md:text-2xl">
        {headline || t("home.flowersTitle")}
      </h1>
      <p className="text-sm text-muted-foreground text-center max-w-2xl">
        {description || t("home.flowersDescription")}
      </p>
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 justify-items-center w-full max-w-4xl">
        {categories.length === 0 ? (
          <p className="col-span-3 text-sm text-muted-foreground text-center">
            {t("home.flowersEmpty")}
          </p>
        ) : (
          categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              sectionKey="flowers"
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
}
