import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import CustomBackground from "@/components/shared/customBackground";
import BannerCarousel from "@/components/shared/BannerCarousel";
import home1Light from "@/assets/img/home1Light.webp";
import home1Dark from "@/assets/img/home1Dark.webp";
import home2Light from "@/assets/img/home2Light.webp";
import home2Dark from "@/assets/img/home2Dark.webp";
import logoDark from "@/assets/img/logoDark.svg";
import logoLight from "@/assets/img/logoLight.svg";
import { getBanners } from "@/lib/api";
import { getBillzCategories } from "../../actions/get";
import {
  deriveCategorySections,
  extractLeafCategories,
  SECTION_KEYS,
} from "@/lib/catalog";
import { PerfumesSection, FlowersSection } from "./_components/HomeSections";

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

export const revalidate = 3600;

export default async function HomePage() {
  const [categories, bannersResponse] = await Promise.all([
    getBillzCategories({ limit: 50 }).catch(() => []),
    getBanners().catch(() => null),
  ]);

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

        {/* Banner Carousel */}
        <div className="containerCustom relative mx-auto w-11/12">
          <BannerCarousel banners={banners} />
        </div>

        <PerfumesSection
          categories={perfumeCategories}
          headline={perfumesSection?.headline}
          description={perfumesSection?.description}
        />
      </CustomBackground>

      <CustomBackground
        lightImage={home2Light}
        darkImage={home2Dark}
        className="relative w-full md:min-h-screen flex flex-col sm:gap-4 pt-12 sm:pt-24 pb-4"
        quality={100}
        priority
      >
        <SectionHeader />

        <FlowersSection
          categories={flowerCategories}
          headline={flowersSection?.headline}
          description={flowersSection?.description}
        />
      </CustomBackground>
    </div>
  );
}
