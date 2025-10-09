"use client"

import Image from 'next/image'
import React from 'react'
import { Separator } from '../ui/separator'
import { usePathname } from 'next/navigation'

export default function Footer() {
    const pathname = usePathname()

  if (pathname == "/login" || pathname == "/register") {
    return <></>
  }
  return (
    <footer className='text-xs sm:text-sm md:text-md relative bg-[#F9F9F9] dark:bg-[#272727] w-full h-auto before:bg-neutral-200 dark:before:bg-[#CBCBCB] before:absolute before:-top-1 before:w-full before:h-[2px]'>
      <main className='pt-12 pb-4 space-y-5'>
        <section className='max-w-[1440px] w-11/12 mx-auto flex flex-wrap gap-5 justify-between'>
          <div className='flex flex-col gap-3'>
            <div className="relative h-16 w-32 flex-shrink-0">
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
            <ul className='text-neutral-500 dark:text-[#7C7C7C]'>
              <li>
                Адрес: loremipsum
              </li>
              <li>
                Телефон: +998 99 999-99-99
              </li>
              <li>
                Почта: shafran@gmail.com
              </li>
            </ul>
          </div>
          <div>
            <h1>Shafran</h1>
            <ul className='text-neutral-500 dark:text-[#7C7C7C]'>
              <li>
                Shafran Selective
              </li>
              <li>
                Shafran Flowers
              </li>
              <li>
                Уход
              </li>
            </ul>
          </div>
          <div>
            <h1>Справка и поддержка</h1>
            <ul className='text-neutral-500 dark:text-[#7C7C7C]'>
              <li>
                Платежи
              </li>
              <li>
                Возврат продукции
              </li>
              <li>
                Помощь (FAQ)
              </li>
            </ul>
          </div>
          <div>
            <h1>Рабочее время</h1>
            <ul className='text-neutral-500 dark:text-[#7C7C7C]'>
              <li>
                Понедельник - Суббота:<br />
                09:00 - 18:00
              </li>
            </ul>
          </div>
          <div>
            <h1>Подпишитесь, чтобы получать <br />эксклюзивные предложения и последние новости!</h1>
            <ul className='text-neutral-500 dark:text-[#7C7C7C]'>
              <li>
                Nomer telefona
              </li>
              <li className='flex  justify-start items-center gap-2'>
                <div>
                  <Image src="/icons/facebook.svg" alt="img" width={44} height={44} />
                </div>
                <div>
                  <Image src="/icons/instagram.svg" alt="img" width={44} height={44} />
                </div>
                <div>
                  <Image src="/icons/twitter.svg" alt="img" width={44} height={44} />
                </div>
              </li>
            </ul>
          </div>
        </section>
        <Separator className={"border-[1px] bg-neutral-200 dark:bg-[#CBCBCB] w-full"} />
        <section className='flex flex-wrap justify-between items-center max-w-[1440px] w-11/12 mx-auto text-neutral-400 dark:text-[#888888]'>
          <h1>
            © 2025 SHAFRAN. All Rights Reserved.
          </h1>
          <div className='flex justify-end items-center gap-10'>
            <div>
              Политика конфиденциальности
            </div>
            <div>
              Правила и условия использования
            </div>
          </div>
        </section>

      </main>
    </footer>
  )
}
