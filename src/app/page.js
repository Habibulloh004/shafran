"use client"

import Image from "next/image"
import React from "react"
import { Separator } from "@/components/ui/separator"
import CustomBackground from "@/components/shared/customBackground"

import home1Light from "@/assets/img/home1Light.webp"
import home1Dark from "@/assets/img/home1Dark.webp"
import home2Light from "@/assets/img/home2Light.webp"
import home2Dark from "@/assets/img/home2Dark.webp"
import img2Dark from "@/assets/background/2Dark.webp"
import img2Light from "@/assets/background/2Light.webp"
import img3Dark from "@/assets/background/3Dark.webp"
import img3Light from "@/assets/background/3Light.webp"
import creed from "@/assets/background/creed.webp"
import flower from "@/assets/background/flower.webp"
import logoDark from "@/assets/img/logoDark.svg"
import logoLight from "@/assets/img/logoLight.svg"

export default function HomePage() {
  return (
    <div className="">
      {/* Home 1 */}
      <CustomBackground
        lightImage={home1Light}
        darkImage={home1Dark}
        className="relative w-full md:min-h-screen flex  flex-col gap-2 sm:gap-4 py-12 sm:py-24"
        quality={100}
        priority
      >
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
        </div>

        <div className="containerCustom relative mx-auto w-11/12 h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px]">
          <Image
            src={img2Dark}
            alt="dark img"
            fill
            priority
            quality={100}
            placeholder="blur"
            className="absolute inset-0 h-full w-full scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 object-contain aspect-[16/4]"
          />
          <Image
            src={img2Light}
            alt="light img"
            fill
            priority
            quality={100}
            placeholder="blur"
            className="absolute inset-0 h-full w-full scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 object-contain aspect-[16/4]"
          />
        </div>

        <div className="containerCustom flex flex-col justify-center items-center gap-3 sm:gap-5 px-4">
          <h1 className="font-montserrat-alt text-lg sm:text-xl md:text-2xl">Для кого</h1>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 justify-items-center w-full max-w-4xl">
            {[1, 2, 3].map((item, i) => (
              <div
                key={i}
                className={`w-full max-w-[120px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[280px] rounded-lg sm:rounded-xl md:rounded-2xl bg-white/60 dark:bg-black/35 flex flex-col justify-center items-center p-2 sm:p-3 md:p-4 ${
                  i === 1 ? "translate-y-4 sm:translate-y-6 md:translate-y-8 lg:translate-y-10" : ""
                }`}
              >
                <div className="relative w-[80px] h-[60px] sm:w-[120px] sm:h-[90px] md:w-[160px] md:h-[120px] lg:w-[200px] lg:h-[150px] xl:w-[250px] xl:h-[200px]">
                  <Image
                    src={creed}
                    alt="img"
                    fill
                    priority
                    quality={100}
                    placeholder="blur"
                    className="object-contain"
                  />
                </div>
                <p className="text-xs sm:text-sm md:text-base text-black/70 dark:text-white/60">Парфюм</p>
                <h1 className="text-xs sm:text-sm md:text-md font-semibold text-black dark:text-white">
                  {i === 0 ? "ДЛЯ НЕЁ" : i === 1 ? "ДЛЯ НЕГО" : "УНИ"}
                </h1>
              </div>
            ))}
          </div>
        </div>
      </CustomBackground>

      {/* Home 2 */}
      <CustomBackground
        lightImage={home2Light}
        darkImage={home2Dark}
        className="relative w-full md:min-h-screen flex flex-col sm:gap-4 pt-12 sm:pt-24 pb-4"
        quality={100}
        priority
      >
        <div className="containerCustom flex mx-auto w-11/12 justify-center items-center gap-4 sm:gap-8 md:gap-16 relative z-10">
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
        </div>

        <div className="pb-10 containerCustom flex flex-col justify-center items-center gap-3 sm:gap-5 px-4">
          <h1 className="font-montserrat-alt text-lg sm:text-xl md:text-2xl">Категории</h1>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 justify-items-center w-full max-w-4xl">
            {[1, 2, 3].map((item, i) => (
              <div
                key={i}
                className={`w-full max-w-[120px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[280px] rounded-lg sm:rounded-xl md:rounded-2xl bg-white/70 backdrop-blur-[9px] dark:bg-black/35 flex flex-col justify-center items-center p-2 sm:p-3 md:p-4 ${
                  i === 1 ? "translate-y-4 sm:translate-y-6 md:translate-y-8 lg:translate-y-10" : ""
                }`}
              >
                <div className="relative w-[80px] h-[60px] sm:w-[120px] sm:h-[90px] md:w-[160px] md:h-[120px] lg:w-[200px] lg:h-[150px] xl:w-[250px] xl:h-[200px]">
                  <Image
                    src={flower}
                    alt="img"
                    fill
                    priority
                    quality={100}
                    placeholder="blur"
                    className="object-contain"
                  />
                </div>
                <p className="text-xs sm:text-sm md:text-base text-black/70 dark:text-white/60">Парфюм</p>
                <h1 className="text-xs sm:text-sm md:text-md font-semibold text-black dark:text-white">
                  {i === 0 ? "ДЛЯ НЕЁ" : i === 1 ? "ДЛЯ НЕГО" : "УНИ"}
                </h1>
              </div>
            ))}
          </div>
        </div>

        <div className="containerCustom relative mx-auto w-11/12 h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px]">
          <Image
            src={img3Dark}
            alt="dark img"
            fill
            priority
            quality={100}
            placeholder="blur"
            className="absolute inset-0 h-full w-full scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 object-contain aspect-[16/4]"
          />
          <Image
            src={img3Light}
            alt="light img"
            fill
            priority
            quality={100}
            placeholder="blur"
            className="absolute inset-0 h-full w-full scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 object-contain aspect-[16/4]"
          />
        </div>
      </CustomBackground>
    </div>
  )
}
