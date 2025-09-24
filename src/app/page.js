import Image from 'next/image'
import React from 'react'
import { Separator } from '@/components/ui/separator'
import CustomBackground from '@/components/shared/customBackground'

// Pre-define image data for better performance
const cardImages = [
  { src: "/background/creed.webp", alt: "Perfume for her" },
  { src: "/background/creed.webp", alt: "Perfume for him" },
  { src: "/background/creed.webp", alt: "Unisex perfume" }
]

const categories = [
  { src: "/background/flower.webp", alt: "Category 1" },
  { src: "/background/flower.webp", alt: "Category 2" },
  { src: "/background/flower.webp", alt: "Category 3" }
]

export default function HomePage() {
  return (
    <div className='w-full'>
      {/* Home 1 */}
      <CustomBackground
        lightImage="/img/home1Light.webp"
        darkImage="/img/home1Dark.webp"
        className="w-full md:min-h-screen flex justify-start items-center flex-col gap-2 sm:gap-4 py-12 sm:py-24"
        priority={true}
        quality={75}
        preload={true}
      >
        {/* Logo section */}
        <div className="flex w-11/12 mx-auto justify-center items-center gap-4 sm:gap-8 md:gap-16">
          <Separator className="flex-1 bg-separator-color" />

          <div className="relative h-8 w-16 sm:h-12 sm:w-24 md:h-16 md:w-32 flex-shrink-0">
            <Image
              src="/img/logoDark.svg"
              alt="Dark logo"
              width={128}
              height={64}
              priority
              className="absolute inset-0 h-full w-full opacity-0 transition-all duration-300 dark:opacity-100"
            />
            <Image
              src="/img/logoLight.svg"
              alt="Light logo"
              width={128}
              height={64}
              priority
              className="absolute inset-0 h-full w-full opacity-100 transition-all duration-300 dark:opacity-0"
            />
          </div>

          <Separator className="flex-1 bg-separator-color" />
        </div>
        
        {/* Center image section */}
        <div className="relative mx-auto w-11/12 h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px]">
          <Image
            src="/background/2Dark.webp"
            alt="Dark center image"
            fill
            priority
            quality={75}
            className="absolute inset-0 object-contain opacity-0 transition-opacity duration-300 dark:opacity-100"
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 70vw"
          />
          <Image
            src="/background/2Light.webp"
            alt="Light center image"
            fill
            priority
            quality={75}
            className="absolute inset-0 object-contain opacity-100 transition-opacity duration-300 dark:opacity-0"
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 70vw"
          />
        </div>
        
        {/* Cards section */}
        <div className='flex flex-col justify-center items-center gap-3 sm:gap-5 px-4'>
          <h1 className='font-montserrat-alt text-lg sm:text-xl md:text-2xl'>Для кого</h1>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 justify-items-center w-full max-w-4xl">
            {cardImages.map((image, i) => (
              <div
                key={i}
                className={`w-full max-w-[120px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[280px] rounded-lg sm:rounded-xl md:rounded-2xl bg-white/60 backdrop-blur-sm dark:bg-black/35 flex flex-col justify-center items-center p-2 sm:p-3 md:p-4 ${i === 1 ? "translate-y-4 sm:translate-y-6 md:translate-y-8 lg:translate-y-10" : ""
                  }`}
              >
                <div className="relative w-[80px] h-[60px] sm:w-[120px] sm:h-[90px] md:w-[160px] md:h-[120px] lg:w-[200px] lg:h-[150px] xl:w-[250px] xl:h-[200px]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    loading={i < 2 ? "eager" : "lazy"}
                    quality={70}
                    className="object-contain"
                    sizes="(max-width: 640px) 80px, (max-width: 768px) 120px, (max-width: 1024px) 160px, 200px"
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
        lightImage="/img/home2Light.webp"
        darkImage="/img/home2Dark.webp"
        className="w-full md:min-h-screen flex flex-col justify-start items-center gap-2 sm:gap-4 pt-12 sm:pt-24"
        priority={false}
        quality={70}
        preload={false}
      >
        {/* Logo section */}
        <div className="flex w-11/12 mx-auto justify-center items-center gap-4 sm:gap-8 md:gap-16">
          <Separator className="flex-1 bg-separator-color" />

          <div className="relative h-8 w-16 sm:h-12 sm:w-24 md:h-16 md:w-32 flex-shrink-0">
            <Image
              src="/img/logoDark.svg"
              alt="Dark logo"
              width={128}
              height={64}
              loading="lazy"
              className="absolute inset-0 h-full w-full opacity-0 transition-all duration-300 dark:opacity-100"
            />
            <Image
              src="/img/logoLight.svg"
              alt="Light logo"
              width={128}
              height={64}
              loading="lazy"
              className="absolute inset-0 h-full w-full opacity-100 transition-all duration-300 dark:opacity-0"
            />
          </div>

          <Separator className="flex-1 bg-separator-color" />
        </div>
        
        {/* Categories section */}
        <div className='flex flex-col justify-center items-center gap-3 sm:gap-5 px-4'>
          <h1 className='font-montserrat-alt text-lg sm:text-xl md:text-2xl'>Категории</h1>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 justify-items-center w-full max-w-4xl">
            {categories.map((category, i) => (
              <div
                key={i}
                className={`w-full max-w-[120px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[280px] rounded-lg sm:rounded-xl md:rounded-2xl bg-white/70 backdrop-blur-[9px] dark:bg-black/35 flex flex-col justify-center items-center p-2 sm:p-3 md:p-4 ${i === 1 ? "translate-y-4 sm:translate-y-6 md:translate-y-8 lg:translate-y-10" : ""
                  }`}
              >
                <div className="relative w-[80px] h-[60px] sm:w-[120px] sm:h-[90px] md:w-[160px] md:h-[120px] lg:w-[200px] lg:h-[150px] xl:w-[250px] xl:h-[200px]">
                  <Image
                    src={category.src}
                    alt={category.alt}
                    fill
                    loading="lazy"
                    quality={65}
                    className="object-contain"
                    sizes="(max-width: 640px) 80px, (max-width: 768px) 120px, (max-width: 1024px) 160px, 200px"
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
        
        {/* Bottom image section */}
        <div className="relative mx-auto w-11/12 h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px]">
          <Image
            src="/background/3Dark.webp"
            alt="Dark bottom image"
            fill
            loading="lazy"
            quality={65}
            className="absolute inset-0 object-contain opacity-0 transition-opacity duration-300 dark:opacity-100"
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 70vw"
          />
          <Image
            src="/background/3Light.webp"
            alt="Light bottom image"
            fill
            loading="lazy"
            quality={65}
            className="absolute inset-0 object-contain opacity-100 transition-opacity duration-300 dark:opacity-0"
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 70vw"
          />
        </div>
      </CustomBackground>
    </div>
  )
}