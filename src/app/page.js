import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import CustomBackground from "@/components/shared/customBackground";
import home1Light from "@/assets/img/home1Light.webp";
import home1Dark from "@/assets/img/home1Dark.webp";
import home2Light from "@/assets/img/home2Light.webp";
import home2Dark from "@/assets/img/home2Dark.webp";
import img2Dark from "@/assets/background/2Dark.webp";
import img2Light from "@/assets/background/2Light.webp";
import img3Dark from "@/assets/background/3Dark.webp";
import img3Light from "@/assets/background/3Light.webp";
import logoDark from "@/assets/img/logoDark.svg";
import logoLight from "@/assets/img/logoLight.svg";
import { getBanners, getCategories } from "@/lib/api";
import {
  deriveCategorySections,
  extractLeafCategories,
  SECTION_KEYS,
} from "@/lib/catalog";

const FALLBACK_CARD_IMAGE = "/background/creed.webp";

const buildCategoryHref = (categoryId, sectionKey) => {
  if (!categoryId) return "#";
  const params = sectionKey ? `?section=${sectionKey}` : "";
  return `/category/${categoryId}${params}`;
};

const pickCategoryImage = (category) =>
  category?.card_image ||
  category?.hero_image_light ||
  category?.hero_image_dark ||
  FALLBACK_CARD_IMAGE;

const renderCategoryCard = (category, sectionKey, index) => {
  if (!category) return null;

  const href = buildCategoryHref(category.id, sectionKey);

  return (
    <Link
      href={href}
      key={category.id}
      className={`w-full max-w-[120px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[280px] rounded-lg sm:rounded-xl md:rounded-2xl bg-white/60 dark:bg-black/35 flex flex-col justify-center items-center p-2 sm:p-3 md:p-4 ${
        index === 1 ? "translate-y-4 sm:translate-y-6 md:translate-y-8 lg:translate-y-10" : ""
      }`}
      prefetch={false}
    >
      <div className="relative w-[80px] h-[60px] sm:w-[120px] sm:h-[90px] md:w-[160px] md:h-[120px] lg:w-[200px] lg:h-[150px] xl:w-[250px] xl:h-[200px]">
        <Image
          src={pickCategoryImage(category)}
          alt={category.name || "Категория"}
          fill
          priority
          quality={100}
          className="object-contain"
        />
      </div>
      <p className="text-xs sm:text-sm md:text-base text-black/70 dark:text-white/60">
        {category.subtitle || category.description || "Коллекция"}
      </p>
      <h2 className="text-xs sm:text-sm md:text-md font-semibold text-black dark:text-white">
        {category.name || "Категория"}
      </h2>
    </Link>
  );
};

const SectionHeader = ({ children }) => (
  <div className="pt-4 containerCustom flex mx-auto w-11/12 justify-center items-center gap-4 sm:gap-8 md:gap-16 relative z-10">
    <Separator className="flex-1 bg-separator-color" />

    <div className="relative h-8 w-16 sm:h-12 sm:w-24 md:h-16 md:w-32 flex-shrink-0">
      <Image
        src={logoDark}
        alt="dark mode"
        fill
        priority
        className="absolute inset-0 h-full w-full scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
      />
      <Image
        src={logoLight}
        alt="light mode"
        fill
        priority
        className="absolute inset-0 h-full w-full scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
      />
    </div>

    <Separator className="flex-1 bg-separator-color" />
    {children}
  </div>
);

export default async function HomePage() {
  const [categoriesResponse, bannersResponse] = await Promise.all([
    getCategories({ limit: 50 }).catch(() => ({ categories: [] })),
    getBanners().catch(() => null),
  ]);

  const categories =
    categoriesResponse?.categories ||
    categoriesResponse?.data ||
    categoriesResponse ||
    [];

  const sections = deriveCategorySections(categories);
  const flowersSection = sections.find(
    (section) => section.key === SECTION_KEYS.FLOWERS
  );
  const perfumesSection = sections.find(
    (section) => section.key === SECTION_KEYS.PERFUMES
  );

  const flowerCategories = extractLeafCategories(flowersSection).slice(0, 6);
  const perfumeCategories = extractLeafCategories(perfumesSection).slice(0, 6);
  const banners = bannersResponse?.data || [];

  return (
    <div>
      <CustomBackground
        lightImage={home1Light}
        darkImage={home1Dark}
        className="relative w-full md:min-h-screen flex flex-col gap-2 sm:gap-4 py-12 sm:py-24"
        quality={100}
        priority
      >
        <SectionHeader />

        <div className="containerCustom relative mx-auto w-11/12 h-20 md:h-42">
          <Image
            src={img2Dark}
            alt="dark img"
            fill
            priority
            quality={100}
            placeholder="blur"
            className="absolute inset-0 h-full w-full scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 object-cover aspect-[16/4] rounded-2xl"
          />
          <Image
            src={img2Light}
            alt="light img"
            fill
            priority
            quality={100}
            placeholder="blur"
            className="absolute inset-0 h-full w-full scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 object-cover aspect-[16/4] rounded-2xl"
          />
        </div>

        <div className="containerCustom flex flex-col justify-center items-center gap-3 sm:gap-5 px-4">
          <h1 className="font-montserrat-alt text-lg sm:text-xl md:text-2xl">
            {perfumesSection?.headline || "Shafran Perfumes"}
          </h1>
          <p className="text-sm text-muted-foreground text-center max-w-2xl">
            {perfumesSection?.description ||
              "Духи и ароматы, подобранные по настроению и случаю."}
          </p>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 justify-items-center w-full max-w-4xl">
            {perfumeCategories.length === 0 ? (
              <p className="col-span-3 text-sm text-muted-foreground text-center">
                Подкатегории парфюмерии будут доступны позже.
              </p>
            ) : (
              perfumeCategories.map((category, index) =>
                renderCategoryCard(category, SECTION_KEYS.PERFUMES, index)
              )
            )}
          </div>
        </div>
      </CustomBackground>

      <CustomBackground
        lightImage={home2Light}
        darkImage={home2Dark}
        className="relative w-full md:min-h-screen flex flex-col sm:gap-4 pt-12 sm:pt-24 pb-4"
        quality={100}
        priority
      >
        <SectionHeader />

        <div className="pb-10 containerCustom flex flex-col justify-center items-center gap-3 sm:gap-5 px-4">
          <h1 className="font-montserrat-alt text-lg sm:text-xl md:text-2xl">
            {flowersSection?.headline || "Shafran Flowers"}
          </h1>
          <p className="text-sm text-muted-foreground text-center max-w-2xl">
            {flowersSection?.description ||
              "Авторские букеты, составленные из сезонных цветов и эксклюзивных позиций."}
          </p>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 justify-items-center w-full max-w-4xl">
            {flowerCategories.length === 0 ? (
              <p className="col-span-3 text-sm text-muted-foreground text-center">
                Букеты и цветочные коллекции появятся здесь позже.
              </p>
            ) : (
              flowerCategories.map((category, index) =>
                renderCategoryCard(category, SECTION_KEYS.FLOWERS, index)
              )
            )}
          </div>
        </div>

        {banners.length > 0 ? (
          <div className="containerCustom relative mx-auto w-11/12 mt-4 md:mt-10 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.slice(0, 2).map((banner) => (
              <Link
                href={banner.url || "#"}
                key={banner.id}
                className="relative h-40 md:h-48 rounded-2xl overflow-hidden bg-black/10 dark:bg-white/10 flex items-center justify-center"
              >
                <Image
                  src={banner.image_light || banner.image_dark || FALLBACK_CARD_IMAGE}
                  alt={banner.title || "Banner"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <p className="text-white text-lg font-semibold text-center px-4">
                    {banner.title || "Специальное предложение"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="containerCustom relative mx-auto w-11/12 h-20 md:h-42 mt-4 md:mt-10 mb-4">
            <Image
              src={img3Dark}
              alt="dark img"
              fill
              priority
              quality={100}
              placeholder="blur"
              className="absolute inset-0 h-full w-full scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 object-cover rounded-2xl aspect-[16/4]"
            />
            <Image
              src={img3Light}
              alt="light img"
              fill
              priority
              quality={100}
              placeholder="blur"
              className="absolute inset-0 h-full w-full scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 object-cover rounded-2xl aspect-[16/4]"
            />
          </div>
        )}
      </CustomBackground>
    </div>
  );
}
