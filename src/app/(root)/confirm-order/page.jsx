import CustomBackground from '@/components/shared/customBackground'
import React from 'react'
import famale from "@/assets/background/famale.webp";
import male from "@/assets/background/male.webp";
import { cn } from '@/lib/utils';
import { CreditCard } from 'lucide-react';
import Order from './_components/order';
import Payment from './_components/payment';
import { getBillzProducts } from '../../../../actions/get';
import SimilarProductsCarousel from './_components/SimilarProductsCarousel';
import ConfirmOrderSuccess from './_components/ConfirmOrderSuccess';
import OrderConfirmationTitle from './_components/OrderConfirmationTitle';

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
        <ConfirmOrderSuccess />
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
            <OrderConfirmationTitle />
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
