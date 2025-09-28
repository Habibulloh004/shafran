import CustomBackground from '@/components/shared/customBackground'
import React from 'react'
import famale from "@/assets/background/famale.webp";
import male from "@/assets/background/male.webp";
import { cn } from '@/lib/utils';
import ProductItem from '@/components/shared/productItem';
export default function page({ searchParams }) {
  const gender = searchParams?.gender;
  return (
    <CustomBackground
      singleImage={gender == "famale" ? famale : male}
      className="relative w-full md:min-h-screen flex flex-col sm:gap-4 pt-12 sm:pt-24 pb-4"
      quality={100}
      type="single"
      classNameImage={cn(
        gender == "male" ? "opacity-20" : "opacity-50 dark:opacity-30"
      )}
      priority
    >
      <section>
        1
      </section>
      <section className='containerCustom w-11/12 pt-10 space-y-4'>
        <h1 className='text-center text-xl md:text-3xl font-bold'>
          Похожие товары
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
          {[1, 2, 3, 4, 5, 6]?.map((item) => (
            <ProductItem key={item} />
          ))}
        </div>
      </section>
    </CustomBackground>
  )
}
