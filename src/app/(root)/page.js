import Image from 'next/image'
import React from 'react'
import { Separator } from '@/components/ui/separator'

export default function HomePage() {
  return (
    <div>
      {/* Home 1 */}
      <div
        className="
          relative 
          w-full md:min-h-screen 
          flex justify-start items-center flex-col gap-2 sm:gap-4
          overflow-hidden
          bg-[url('/img/home1Light.webp')] 
          dark:bg-[url('/img/home1Dark.webp')]
          bg-no-repeat bg-cover bg-[center_70%]
          bg-scroll
          py-12 sm:py-24
        "
      >
        <div className="flex w-9/12 justify-center items-center gap-4 sm:gap-8 md:gap-16">
          <Separator className="flex-1 bg-separator-color" />

          <div className="relative h-8 w-16 sm:h-12 sm:w-24 md:h-16 md:w-32 flex-shrink-0">
            <Image
              loading="eager"
              src="/img/logoDark.svg"
              alt="light mode"
              width={128}
              height={64}
              className="absolute inset-0 h-full w-full scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
            />
            <Image
              loading="eager"
              src="/img/logoLight.svg"
              alt="dark mode"
              width={128}
              height={64}
              className="absolute inset-0 h-full w-full scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
            />
          </div>

          <Separator className="flex-1 bg-separator-color" />
        </div>
        
        <div className="relative w-11/12 h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px]">
          <Image
            src="/background/2Dark.webp"
            alt="img"
            fill
            priority
            quality={100}
            className="absolute inset-0 h-full w-full scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 object-contain aspect-[16/4]"
          />
          <Image
            src="/background/2Light.webp"
            alt="img"
            fill
            priority
            quality={100}
            className="absolute inset-0 h-full w-full scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 object-contain aspect-[16/4]"
          />
        </div>
        
        <div className='flex flex-col justify-center items-center gap-3 sm:gap-5 px-4'>
          <h1 className='font-montserrat-alt text-lg sm:text-xl md:text-2xl'>Для кого</h1>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 justify-items-center w-full max-w-4xl">
            {[1, 2, 3].map((item, i) => (
              <div
                key={i}
                className={`w-full max-w-[120px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[280px] rounded-lg sm:rounded-xl md:rounded-2xl bg-white/60 dark:bg-black/35 flex flex-col justify-center items-center p-2 sm:p-3 md:p-4 ${i === 1 ? "translate-y-4 sm:translate-y-6 md:translate-y-8 lg:translate-y-10" : ""
                  }`}
              >
                <div className="relative w-[80px] h-[60px] sm:w-[120px] sm:h-[90px] md:w-[160px] md:h-[120px] lg:w-[200px] lg:h-[150px] xl:w-[250px] xl:h-[200px]">
                  <Image
                    src="/background/creed.webp"
                    alt="img"
                    fill
                    priority
                    quality={100}
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
      </div>

      {/* Home 2 */}
      <div
        className="
          relative 
          w-full md:min-h-screen 
          bg-scroll
          flex flex-col justify-start items-center gap-2 sm:gap-4
          overflow-hidden
          bg-[url('/img/home2Light.webp')] 
          dark:bg-[url('/img/home2Dark.webp')]
          bg-no-repeat bg-cover bg-[center_70%]
          pt-12 sm:pt-24
        "
      >
        <div className="flex w-9/12 justify-center items-center gap-4 sm:gap-8 md:gap-16">
          <Separator className="flex-1 bg-separator-color" />

          <div className="relative h-8 w-16 sm:h-12 sm:w-24 md:h-16 md:w-32 flex-shrink-0">
            <Image
              loading="eager"
              src="/img/logoDark.svg"
              alt="light mode"
              width={128}
              height={64}
              className="absolute inset-0 h-full w-full scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
            />
            <Image
              loading="eager"
              src="/img/logoLight.svg"
              alt="dark mode"
              width={128}
              height={64}
              className="absolute inset-0 h-full w-full scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
            />
          </div>

          <Separator className="flex-1 bg-separator-color" />
        </div>
        
        <div className='flex flex-col justify-center items-center gap-3 sm:gap-5 px-4'>
          <h1 className='font-montserrat-alt text-lg sm:text-xl md:text-2xl'>Категории</h1>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 justify-items-center w-full max-w-4xl">
            {[1, 2, 3].map((item, i) => (
              <div
                key={i}
                className={`w-full max-w-[120px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[280px] rounded-lg sm:rounded-xl md:rounded-2xl bg-white/70 backdrop-blur-[9px] dark:bg-black/35 flex flex-col justify-center items-center p-2 sm:p-3 md:p-4 ${i === 1 ? "translate-y-4 sm:translate-y-6 md:translate-y-8 lg:translate-y-10" : ""
                  }`}
              >
                <div className="relative w-[80px] h-[60px] sm:w-[120px] sm:h-[90px] md:w-[160px] md:h-[120px] lg:w-[200px] lg:h-[150px] xl:w-[250px] xl:h-[200px]">
                  <Image
                    src="/background/flower.webp"
                    alt="img"
                    fill
                    priority
                    quality={100}
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
        
        <div className="relative w-11/12 h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px]">
          <Image
            src="/background/3Dark.webp"
            alt="img"
            fill
            priority
            quality={100}
            className="absolute inset-0 h-full w-full scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 object-contain aspect-[16/4]"
          />
          <Image
            src="/background/3Light.webp"
            alt="img"
            fill
            priority
            quality={100}
            className="absolute inset-0 h-full w-full scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 object-contain aspect-[16/4]"
          />
        </div>
      </div>
    </div>
  )
}