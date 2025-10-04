import CustomBackground from '@/components/shared/customBackground';
import React from 'react'
import famale from "@/assets/background/famale.webp";
import male from "@/assets/background/male.webp";
import { cn } from '@/lib/utils';
import { Price } from '@/lib/functions';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import ImageGallery from './_components/ImageGallery';
import ProductTabs from './_components/ProductTabs';
import { Marquee } from '@/components/ui/marquee';
import Link from 'next/link';
import ProductItem from '@/components/shared/productItem';
import ProductDetails from './_components/ProductDetails';

export default async function ProductItemPage({ searchParams }) {
const params = await searchParams; // searchParams ni kutib olish kerak
  const gender = params?.gender;
  const infImg = [
    "/img/inf1.webp",
    "/img/inf2.webp",
    "/img/inf3.webp"
  ]
  return (
    <CustomBackground
      singleImage={gender == "famale" ? famale : male}
      className="relative font-montserrat w-full md:min-h-screen flex flex-col sm:gap-4 pt-12 sm:pt-24 pb-4"
      quality={100}
      type="single"
      classNameImage={cn(
        gender == "male" ? "opacity-20" : "opacity-50 dark:opacity-30"
      )}
      priority
    >
      <main className='w-full space-y-5 pt-4'>
        <section className='w-11/12 mx-auto containerCustom flex justify-between gap-5'>
          <ProductDetails />
          {/* Imaages container */}
          <div className='max-xl:hidden w-10/12'>
            <ImageGallery />
          </div>
        </section>
        <section className='containerCustom w-11/12'>
          <ProductTabs />
        </section>
        <section className=''>
          <div className="bg-primary/15 max-sm:text-xs overflow-hidden">
            <Marquee className="[--duration:100s]">
              <h1 className='px-4'>  Sauvage Dior — это аромат для мужчин, он принадлежит к группе фужерные. Sauvage выпущен в 2015 году. Парфюмер: François Demachy. Верхние ноты:  Калабрийск.</h1>
            </Marquee>
          </div>
          <div className="bg-primary/15 max-sm:text-xs overflow-hidden">
            <Marquee reverse className="[--duration:100s] gap-0 p-0">
              <div className='flex'>
                {infImg?.map((c, i) => (
                  <div key={i} className='w-[300px] h-[200px] md:w-[500px] md:h-[300px] relative'>
                    <Image src={c} alt="img" className='object-cover' fill />
                  </div>
                ))}
              </div>
            </Marquee>
          </div>
        </section>
        <section className='containerCustom w-11/12 pt-10 space-y-4'>
          <h1 className='text-center text-xl md:text-3xl font-bold'>
            Похожие товары
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
            {[1, 2, 3, 4, 5,6]?.map((item) => (
              <ProductItem key={item} />
            ))}
          </div>
        </section>
      </main>
    </CustomBackground>
  )
}
