"use client"

import { Price } from '@/lib/functions'
import Image from 'next/image'
import React from 'react'
import StarRating from './StarRating'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function ProductItem() {
  return (
    <Link href="/category/12/product/12" className='text-primary bg-white/60 dark:bg-black/60 rounded-[20px] overflow-hidden w-auto flex flex-col'>
      <div className='bg-white/60 dark:bg-black/60 relative w-auto h-28 md:h-36'>
        <Image src="/background/creed.webp" className='object-contain p-2' alt="img" fill quality={100} />
      </div>
      <div className='backdrop-blur-2xl px-4 py-3 space-y-2'>
        <div>
          <p className='text-[10px] line-clamp-1 md:text-xs text-primary dark:text-white/40'>Для него</p>
          <h1 className='text-xs line-clamp-2 md:text-md lg:text-xl font-bold'>Creed - silver mountain water</h1>
          <StarRating readOnly value={3} onChange={(val) => console.log("Rating:", val)} />
        </div>
        <div className="flex justify-between items-center gap-3">
          <Price amount={490} />
          <Button className={"w-6 h-6 md:h-10 md:w-10 rounded-full hover:opacity-70 transition-all ease-linear duration-200 cursor-pointer bg-primary text-white"}>
            <Plus className='' />
          </Button>
        </div>

      </div>
    </Link>
  )
}
