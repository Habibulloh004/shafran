"use client"

import CustomBackground from '@/components/shared/customBackground';
import React from 'react';
import famale from "@/assets/background/famale.webp";
import male from "@/assets/background/male.webp";
import { cn } from '@/lib/utils';
import ProfileSidebar from './_components/ProfileSidebar';
import ProfileContent from './_components/ProfileContent';
import { useAuthStore } from '@/store/authStore';

export default function ProfilePage({ searchParams }) {
  const params = React.use(searchParams);
  const activeTab = params?.tab || 'profile';
  const userData = useAuthStore((state) => state.user)

  let orders = [];
  let bonusInfo = { balance: 0, transactions: [] };


  const derivedGender = userData?.gender?.toString().toLowerCase();
  const backgroundImage = derivedGender === "male" ? male : famale;
  const imageOpacity = derivedGender === "male" ? "opacity-20" : "opacity-50 dark:opacity-30";
  
  return (
    <CustomBackground
      singleImage={backgroundImage}
      className="relative w-full md:min-h-screen flex flex-col sm:gap-4 pt-20 sm:pt-24 pb-4"
      quality={100}
      type="single"
      classNameImage={cn(imageOpacity)}
      priority
    >
      <section className='containerCustom space-y-4 w-11/12 md:w-10/12 bg-white/90 dark:bg-black/30 rounded-2xl p-3 md:p-6 md:border border-[#E8EBF1] dark:border-[#E8EBF14D] shadow-[0px_16px_48px_0px_#FFFFFF] dark:shadow-none backdrop-blur-[100px] py-4'>
        <div className="flex flex-row gap-4 lg:gap-6">
          <ProfileSidebar activeTab={activeTab} profile={userData} />
          <ProfileContent
            activeTab={activeTab}
            profile={userData}
            orders={orders}
            bonus={bonusInfo}
          />
        </div>
      </section>
    </CustomBackground>
  );
}
