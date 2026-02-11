'use client';

import ProductItem from '@/components/shared/productItem';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { useTranslation } from '@/i18n';

export default function SimilarProductsCarousel({ products }) {
  const { t } = useTranslation();
  if (!products || products.length === 0) return null;

  return (
    <section className='containerCustom w-11/12 pt-10 space-y-4'>
      <h1 className='text-center text-xl md:text-3xl font-bold'>
        {t("common.similarProducts")}
      </h1>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent gap={4}>
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              gap={4}
              className="basis-1/2 sm:basis-1/3 md:basis-1/3 lg:basis-1/4"
            >
              <ProductItem product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 md:-left-4 bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black border-none shadow-lg" />
        <CarouselNext className="right-0 md:-right-4 bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black border-none shadow-lg" />
      </Carousel>
    </section>
  );
}
