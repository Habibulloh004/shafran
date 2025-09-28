import { Price } from '@/lib/functions'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { Minus, Plus } from 'lucide-react'

export default function CartItem() {
  return (
    <main className="flex w-full">
      {/* Chap qismi */}
      <section className="p-3 flex-1 w-1/2 flex justify-center items-center gap-3">
        <div className="w-full relative h-14 overflow-hidden">
          <Image
            src="/background/home1.webp"
            alt="img"
            fill
            className="object-contain w-full h-full"
          />
        </div>
        <div>
          <h1 className="font-bold text-sm md:text-xl">
            DIOR SAUVAGE{" "}
            <span className="font-[400] text-[10px] text-primary md:text-xs">
              100 ml
            </span>
          </h1>
          <p className="text-primary line-clamp-2 text-xs md:text-sm">
            Sauvage Dior — это аромат для мужчин, он принадлежит к группе
            фужерные. Sauvage выпущен в 2015
          </p>
        </div>
      </section>

      {/* O‘ng qismi */}
      <section className="bg-[#fbfbfb] dark:bg-[#10100F] dark: p-3 flex-1 flex flex-col justify-between gap-2">
        <div className='flex justify-center items-center'>
          <div className="flex items-center gap-1 text-xl md:text-3xl font-bold">
            <span>{"122"}</span>
            <span className="text-xs md:text-lg">$</span>
          </div>
        </div>

        {/* Plus / Count / Minus */}
        <div className="flex gap-2 justify-center items-center">
          <Button
            variant="icon"
            className="flex-1 transition active:scale-90 hover:bg-primary/20 active:bg-primary/30"
          >
            <Plus />
          </Button>
          <span className="flex-1 text-center text-sm md:text-xl font-bold">12</span>
          <Button
            variant="icon"
            className="flex-1 transition active:scale-90 hover:bg-primary/20 active:bg-primary/30"
          >
            <Minus />
          </Button>
        </div>
      </section>
    </main>
  )
}
