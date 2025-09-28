import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import CartItem from './CartItem'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
export default function CartDropdown() {
  return (
    <>
      <div className='max-md:hidden'>
        <DropdownMenu className="">
          <DropdownMenuTrigger>
            <Button variant="icon" size="icon" className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10">
              <Image
                loading="eager"
                src="/icons/cartDark.svg"
                alt="light mode"
                width={0}
                height={0}
                className="absolute h-[1.1rem] w-[1.1rem] md:h-[1.2rem] md:w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
              />
              <Image
                loading="eager"
                src="/icons/cartLight.svg"
                alt="dark mode"
                width={0}
                height={0}
                className="h-[1.1rem] w-[1.1rem] md:h-[1.2rem] md:w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="mr-6 max-md:hidden p-6 bg-white/80 dark:bg-black/80 backdrop-blur-[10px] min-w-auto max-w-xl right-1/2 left-1/2"
          >
            <DropdownMenuLabel className="text-2xl text-center pb-2 border-b-2">
              Корзина
            </DropdownMenuLabel>

            {/* Scroll qiladigan container */}
            <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scroll pt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((caches, i) => (
                <DropdownMenuItem
                  key={i}
                  className="max-w-auto min-w-auto bg-white shadow dark:bg-[#151515] p-0 rounded-2xl overflow-hidden"
                  onSelect={(e) => e.preventDefault()} // yopilib ketmasin
                >
                  <CartItem />
                </DropdownMenuItem>
              ))}
            </div>

            <div className="flex justify-center items-center gap-3 pt-4">
              <Button
                variant={"outline"}
                className="flex-1 h-11 rounded-2xl dark:bg-primary/50 dark:hover:bg-primary/70 bg-primary/70 text-white hover:bg-primary/50 hover:text-white cursor-pointer"
              >
                Подтведить заказ
              </Button>
              <Button
                variant={"outline"}
                className="flex-1 h-11 rounded-2xl bg-primary/10 text-black dark:text-white"
              >
                Убрать всё
              </Button>
            </div>
          </DropdownMenuContent>

        </DropdownMenu>
      </div>
      <div className='md:hidden'>
        <Dialog className="md:hidden">
          <DialogTrigger asChild>
            <Button
              variant="icon"
              size="icon"
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
            >
              <Image
                loading="eager"
                src="/icons/cartDark.svg"
                alt="light mode"
                width={0}
                height={0}
                className="absolute h-[1.1rem] w-[1.1rem] md:h-[1.2rem] md:w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
              />
              <Image
                loading="eager"
                src="/icons/cartLight.svg"
                alt="dark mode"
                width={0}
                height={0}
                className="h-[1.1rem] w-[1.1rem] md:h-[1.2rem] md:w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
              />
            </Button>
          </DialogTrigger>
          <DialogContent
            mark="false"
            overlay={"false"}
            classnameOverlay="bg-transparent backdrop-blur-none"
            className="
        p-2 
        bg-white/80 dark:bg-black/80 
        backdrop-blur-[10px] 
        w-11/12 rounded-xl sm:w-10/12
        fixed top-16 left-1/2 -translate-x-1/2
        min-h-96
        flex flex-col
        md:hidden
        custom-scroll
      "
          >
            <DialogHeader className={"p-0"}>
              <DialogTitle className="text-2xl text-center">
                Корзина
              </DialogTitle>
              <DialogDescription className="hidden">
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <div className='custom-scroll pr-1 flex-1 space-y-2 max-h-[calc(100vh-400px)] overflow-y-scroll'>
              {[1, 2, 3, 4, 5, 6]?.map((caches, i) => (
                <div key={i} className="max-w-auto min-w-auto bg-white shadow dark:bg-[#151515] p-0 rounded-2xl overflow-hidden">
                  <CartItem />
                </div>
              ))}
            </div>
            <div className='flex justify-center items-center gap-3 pb-4'>
              <Button variant={"outline"} className={"flex-1 h-10 rounded-2xl dark:bg-primary/50 dark:hover:bg-primary/70 bg-primary/70 text-white hover:bg-primary/50 hover:text-white cursor-pointer"}>
                Подтведить заказ
              </Button>
              <Button variant={"outline"} className={"flex-1 h-10 rounded-2xl bg-primary/10 text-black dark:text-white"}>
                Убрать всё
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

    </>
  )
}
