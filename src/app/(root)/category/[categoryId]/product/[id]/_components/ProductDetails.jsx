import { Button } from '@/components/ui/button'
import { Price } from '@/lib/functions'
import Image from 'next/image'
import React from 'react'
import ImageGallery from './ImageGallery'

export default function ProductDetails() {
  const images = [
    "/img/res1.webp",
    "/img/res2.webp",
    "/img/res3.webp",
    "/img/res4.webp",
    "/img/res5.webp",
    "/img/res6.webp",
  ]
  return (
    <div className='flex flex-col justify-end items-end gap-4'>
      <div className='xl:hidden w-full justify-center items-center gap-10 flex'>
        <ImageGallery />
        <div className='flex flex-col gap-3 justify-center items-center'>
          <Button type="outline" className={"rounded-xl h-10 md:h-12 w-32 text-[10px] md:text-md md:w-48 bg-white text-primary hover:text-primary hover:bg-white/70 cursor-pointer dark:bg-primary dark:text-white dark:hover:bg-primary/70"}>
            В корзину
          </Button>
          <Button type="outline" className={"rounded-xl h-10 md:h-12 w-32 text-[10px] md:text-md md:w-48 bg-white text-primary hover:text-primary hover:bg-white/70 cursor-pointer dark:bg-primary dark:text-white dark:hover:bg-primary/70"}>
            Купить в 1 клик
          </Button>
          <Button type="outline" className={"rounded-xl h-10 md:h-12 w-32 text-[10px] md:text-md md:w-48 bg-white text-primary hover:text-primary hover:bg-white/70 cursor-pointer dark:bg-primary dark:text-white dark:hover:bg-primary/70"}>
            Распив
          </Button>
        </div>
      </div>
      <div className='w-full md:w-11/12 xl:w-10/12 mx-auto flex justify-between items-center gap-3'>
        <h1 className='text-xl md:text-3xl font-bold'>
          DIOR SAUVAGE
          <span className='text-primary text-xs ml-4'>
            100 мл
          </span>
        </h1>
        <Price amount={398} />
      </div>
      <div className='flex justify-between items-center gap-2'>
        <p className='text-xs md:text-md w-full md:w-10/12 xl:w-8/12 mx-auto line-clamp-6'>Sauvage Dior — это аромат для мужчин, он принадлежит к группе фужерные. Sauvage выпущен в 2015 году. Парфюмер: François Demachy. Верхние ноты:  Калабрийский бергамот и Перец; средние ноты: Сычуанский перец, Лаванда,  Розовый перец, Ветивер, Пачули, Герань и Элеми; базовые ноты: Ambroxan,  Кедр и Лабданум.</p>
        <div className='w-full md:hidden flex justify-end items-end'>
          <div className='grid grid-cols-3 gap-[2px]'>
            {images?.map((c, i) => (
              <div key={i} className='rounded-[10px] w-10 h-10 relative overflow-hidden'>
                <Image src={c} alt="img" fill className='object-cover' />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='w-full md:w-11/12 xl:w-9/12 flex justify-between items-center'>
        <div className="w-full mt-6 text-xs md:text-sm">
          <p><b>Тестер:</b> Да</p>
          <p><b>Производитель:</b> LVMH</p>
          <p><b>Бренд:</b> Dior</p>
          <p><b>Семейство:</b> древесный, пряный</p>
          <p><b>Группа ароматов:</b> фужерные</p>
          <p><b>Пол:</b> Мужской</p>
          <p><b>Состав:</b> Амброксан, ваниль</p>
          <p><b>Страна производства:</b> Франция</p>
        </div>
        <div className='max-md:hidden flex flex-col gap-3 justify-center items-center'>
          <Button type="outline" className={"w-48 bg-white text-primary hover:text-primary hover:bg-white/70 cursor-pointer dark:bg-primary dark:text-white dark:hover:bg-primary/70"}>
            В корзину
          </Button>
          <Button type="outline" className={"w-48 bg-white text-primary hover:text-primary hover:bg-white/70 cursor-pointer dark:bg-primary dark:text-white dark:hover:bg-primary/70"}>
            Купить в 1 клик
          </Button>
          <Button type="outline" className={"w-48 bg-white text-primary hover:text-primary hover:bg-white/70 cursor-pointer dark:bg-primary dark:text-white dark:hover:bg-primary/70"}>
            Распив
          </Button>
        </div>
      </div>
      <div className='max-md:hidden w-10/12 mx-auto flex justify-start items-start'>
        <div className='grid grid-cols-3 gap-[2px]'>
          {images?.map((c, i) => (
            <div key={i} className='rounded-[10px] w-10 h-10 relative overflow-hidden'>
              <Image src={c} alt="img" fill className='object-cover' />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
