'use client';

import React, { useState, useMemo } from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useOrderStore, computeOrderTotals } from "@/store/orderStore";
import CartItem from './CartItem';
import Link from "next/link";

const CartList = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Ваша корзина пуста
      </div>
    );
  }

  return (
    <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2 custom-scroll pt-2">
      {items.map((item) => (
        <DropdownMenuItem
          key={item.key}
          className="bg-white shadow dark:bg-[#151515] p-0 rounded-2xl overflow-hidden"
          onSelect={(e) => e.preventDefault()}
        >
          <CartItem item={item} />
        </DropdownMenuItem>
      ))}
    </div>
  );
};

export default function CartDropdown() {
  const items = useOrderStore((state) => state.items);
  const clearCart = useOrderStore((state) => state.clearCart);
  const totals = useMemo(() => computeOrderTotals(items), [items]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleClearCart = () => {
    clearCart();
    setDialogOpen(false);
    setDropdownOpen(false);
  };

  const handleGoToOrder = () => {
    setDialogOpen(false);
    setDropdownOpen(false);
  };

  const renderFooter = (isDialog = false) => {
    const layoutClasses = isDialog
      ? "flex-col items-stretch"
      : "flex-row items-center";
    const actionWidth = isDialog ? "w-full" : "flex-1";

    return (
      <div
        className={`flex ${layoutClasses} justify-center gap-3 pt-4 w-full`}
      >
        <Link
          href="/confirm-order"
          onClick={handleGoToOrder}
          className={`${actionWidth} h-11 rounded-2xl bg-primary/70 text-white flex items-center justify-center hover:bg-primary/60`}
        >
          Оформить заказ
        </Link>
        {items.length > 0 && (
          <Button
            variant={"outline"}
            className={`${actionWidth} h-11 rounded-2xl bg-primary/10 text-black dark:text-white`}
            onClick={handleClearCart}
          >
            Убрать всё
          </Button>
        )}
      </div>
    );
  };

  return (
    <>
      <div className='max-md:hidden'>
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen} className="">
          <DropdownMenuTrigger asChild>
            <Button variant="icon" size="icon" className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10">
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
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full px-1">
                  {items.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="mt-4 mr-6 max-md:hidden p-6 bg-white/80 dark:bg-black/80 backdrop-blur-[10px] min-w-auto md:min-w-md max-w-xl right-1/2 left-1/2"
          >
            <DropdownMenuLabel className="text-2xl text-center pb-2 border-b-2 flex flex-col gap-1">
              <span>Корзина</span>
              {totals.quantity > 0 && (
                <span className="text-sm text-muted-foreground">
                  {totals.quantity} товаров · {totals.amount.toLocaleString()} {totals.currency}
                </span>
              )}
            </DropdownMenuLabel>

            <CartList items={items} />

            {renderFooter(false)}
          </DropdownMenuContent>

        </DropdownMenu>
      </div>
      <div className='md:hidden'>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen} className="md:hidden">
          <DialogTrigger asChild>
            <Button
              variant="icon"
              size="icon"
              className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
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
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full px-1">
                  {items.length}
                </span>
              )}
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
        mt-4
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
            <div className='custom-scroll pr-1 flex-1 space-y-2 w-full max-h-[calc(100vh-400px)] overflow-y-auto'>
              {items.length === 0 ? (
                <p className="text-sm text-center text-muted-foreground py-6">
                  Ваша корзина пуста
                </p>
              ) : (
                items.map((item) => (
                  <div key={item.key} className="bg-white shadow dark:bg-[#151515] p-0 rounded-2xl overflow-hidden">
                    <CartItem item={item} />
                  </div>
                ))
              )}
            </div>
            {renderFooter(true)}
          </DialogContent>
        </Dialog>
      </div>

    </>
  )
}
