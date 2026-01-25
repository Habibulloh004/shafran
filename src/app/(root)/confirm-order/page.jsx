import CustomBackground from '@/components/shared/customBackground'
import React from 'react'
import famale from "@/assets/background/famale.webp";
import male from "@/assets/background/male.webp";
import { cn } from '@/lib/utils';
import { CreditCard } from 'lucide-react';
import Order from './_components/order';
import Payment from './_components/payment';
import Image from 'next/image';
import Link from 'next/link';
import { getBillzProducts } from '../../../../actions/get';
import SimilarProductsCarousel from './_components/SimilarProductsCarousel';

const resolveSearchParams = async (searchParams) => {
  if (!searchParams) return {};
  if (typeof searchParams.then === "function") {
    return await searchParams;
  }
  return searchParams;
};

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default async function ConfirmPage({ searchParams }) {
  const params = await resolveSearchParams(searchParams);
  const gender = params?.gender;
  const success = params?.status === "success";

  // Billz API dan productlarni olish va 10 ta random tanlash
  let randomProducts = [];
  try {
    const { data: products } = await getBillzProducts({ limit: 50 });
    if (products && products.length > 0) {
      const shuffled = shuffleArray(products);
      randomProducts = shuffled.slice(0, 10);
    }
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
  
  if (success) {
    return (
      <CustomBackground
        singleImage={gender == "famale" ? famale : male}
        className="relative w-full md:min-h-screen flex flex-col sm:gap-4 pt-20 sm:pt-24 pb-4"
        quality={100}
        type="single"
        classNameImage={cn(
          gender == "male" ? "opacity-20" : "opacity-50 dark:opacity-30"
        )}
        priority
      >
        <section className='containerCustom space-y-4 w-11/12 lg:w-10/12 xl:w-9/12 2xl:w-8/12 bg-white/75 dark:md:bg-black/30 rounded-2xl p-3 md:p-10 md:border border-[#E8EBF1] dark:border-[#E8EBF14D] shadow-[0px_16px_48px_0px_#FFFFFF] dark:shadow-none backdrop-blur-[100px] py-6'>
          <div className='w-full flex justify-center items-center flex-col gap-10'>
            <div className="relative w-full h-12 sm:h-24 md:max-h-16">
              <Image
                loading="eager"
                src="/img/logoDark.svg"
                alt="light mode"
                width={0}
                height={0}
                className="absolute h-full w-full scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
              />
              <Image
                loading="eager"
                src="/img/logoLight.svg"
                alt="dark mode"
                width={0}
                height={0}
                className="h-full w-full scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
              />
            </div>
            <div className='text-center flex justify-center items-center flex-col'>
              <h1 className='text-xs md:text-lg'>Заказ успешно принят.</h1>
              <p className='text-xs md:text-lg'>Наши менеджеры свяжутся с вами в ближайшее время</p>
            </div>
            <div className="relative w-16 sm:w-24 md:w-48 h-12 sm:h-24 md:h-32">
              <Image
                loading="eager"
                src="/icons/check.svg"
                alt="light mode"
                width={0}
                height={0}
                className="h-full w-full scale-100 rotate-0 transition-all"
              />
            </div>
            <div className='text-xs md:text-lg flex justify-around gap-3'>
              <Link href="/">
                Главная страница
              </Link>
              <Link href="/">
                Главная страница
              </Link>
            </div>
          </div>
        </section>
        <SimilarProductsCarousel products={randomProducts} />
      </CustomBackground>
    )
  } else {
    return (
      <CustomBackground
        singleImage={gender == "famale" ? famale : male}
        className="relative w-full md:min-h-screen flex flex-col sm:gap-4 pt-20 sm:pt-24 pb-4"
        quality={100}
        type="single"
        classNameImage={cn(
          gender == "male" ? "opacity-20" : "opacity-50 dark:opacity-30"
        )}
        priority
      >
        <section className='containerCustom space-y-4 w-11/12 lg:w-10/12 xl:w-9/12 2xl:w-8/12 md:bg-white/75 dark:md:bg-black/30 rounded-2xl p-3 md:p-10 md:border border-[#E8EBF1] dark:border-[#E8EBF14D] md:shadow-[0px_16px_48px_0px_#FFFFFF] dark:shadow-none md:backdrop-blur-[100px] '>
          <div className='flex justify-start items-center gap-4'>
            <div variant="icons" className={"flex justify-center items-center w-10 h-10  rounded-xl bg-primary/60 text-white"}>
              <CreditCard size={24} />
            </div>
            <h1 className='text-sm md:text-md 2xl:text-xl'>
              Подтверждения заказа
            </h1>
          </div>
          <div className='flex gap-5 md:gap-16 flex-col-reverse md:flex-row'>
            <Payment />
            <Order gender={gender} />
          </div>
        </section>
        <SimilarProductsCarousel products={randomProducts} />
      </CustomBackground>
    )
  }
}
