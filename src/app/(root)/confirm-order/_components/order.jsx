import { File } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export default function Order() {
  return (
    <div className='flex-1'>
      <div className='relative flex flex-col justify-center items-center pt-3 overflow-y-visible overflow-x-hidden max-w-xl w-full'>
        <div className='bg-[#C7DAE1] dark:bg-[#DDEBF5B2] w-full rounded-lg'>
          <div className='min-h-48 md:min-h-[400px] max-w-xl w-full backdrop-blur-2xl p-5 rounded-t-2xl'>
            <h1 className='text-primary dark:text-gray-600 text-lg md:text-xl font-normal mb-5'>
              Корзина
            </h1>
            <div className='max-h-48 md:max-h-[300px] overflow-y-scroll custom-scroll w-11/12 px-3 py-2 rounded-md mx-auto dark:bg-[#C7DAE1] bg-[#DDEBF5B2] flex flex-col gap-3'>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14]?.map((item) => (
                <div className='flex justify-between items-center gap-3' key={item}>
                  <h1 className='text-gray-500'>Dior SAUVAGE</h1>
                  <p className='text-gray-800'>1050$</p>
                </div>
              ))}
            </div>
          </div>
          <div className='relative before:absolute before:-top-5 before:-left-5 before:w-10 before:bg-white before:h-10 before:rounded-full before:z-10 after:absolute after:-top-5 after:-right-5 after:w-10 after:bg-white after:h-10 after:rounded-full after:z-10 max-w-xl w-full' >
            <div class="w-full h-0 opacity-100 border border-dashed  border-primary [border-image:repeating-linear-gradient(90deg,black_0,black_8px,transparent_8px,transparent_16px)_1]"></div>
          </div>

          <div className='flex justify-between items-center gap-3 max-w-xl w-full backdrop-blur-2xl p-5 rounded-b-2xl'>
            <div>
              <h1 className='text-lg text-primary dark:text-gray-600'>Общая сумма</h1>
              <p className='text-3xl text-primary dark:text-gray-600'>$ 2110</p>
            </div>
            <Image src="/icons/file.svg" width={50} height={50} alt="file" />
          </div>
        </div>
        <div className='absolute -z-10 w-24 h-6 bg-[#858585] rounded-md -top-0 left-auto right-auto' />
      </div>
    </div>
  )
}
