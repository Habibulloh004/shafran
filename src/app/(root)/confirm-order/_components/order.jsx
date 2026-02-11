'use client';

import Image from 'next/image'
import React, { useCallback, useMemo, useState, useTransition } from 'react'
import { useOrderStore, computeOrderTotals } from '@/store/orderStore'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { createOrder } from 'actions/post';
import { useProfileStore } from '@/store/profileStore';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useTranslation } from '@/i18n';

export default function Order({ gender = null }) {
  const { t } = useTranslation();
  const items = useOrderStore((state) => state.items)
  const clearCart = useOrderStore((state) => state.clearCart)
  const resetCheckout = useOrderStore((state) => state.resetCheckout)
  const updateQuantity = useOrderStore((state) => state.updateQuantity)
  const removeItem = useOrderStore((state) => state.removeItem)
  const totals = useMemo(() => computeOrderTotals(items), [items])

  const deliveryMethod = useOrderStore((state) => state.deliveryMethod)
  const paymentMethod = useOrderStore((state) => state.paymentMethod)
  const selectedDigitalPayment = useOrderStore((state) => state.selectedDigitalPayment)
  const language = useOrderStore((state) => state.language)
  const setOrders = useProfileStore((state) => state.setOrders)
  const orders = useProfileStore((state) => state.orders)
  const checkoutState = useMemo(
    () => ({
      deliveryMethod,
      paymentMethod,
      selectedDigitalPayment,
      language,
    }),
    [deliveryMethod, paymentMethod, selectedDigitalPayment, language]
  )

  const user = useAuthStore((state) => state.user)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Login dialog state
  const [isLoginDialogOpen, setLoginDialogOpen] = useState(false)

  // Error dialog state
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = useCallback(() => {
    if (!user?.id) {
      setLoginDialogOpen(true)
      return
    }
    console.log("[checkout] submitting order...", { items, checkoutState, totals, user })
    startTransition(async () => {
      const result = await createOrder({
        items,
        checkout: checkoutState,
        totals,
        user,
      })
      console.log("[checkout] order submission result:", result)
      if (!result?.success) {
        setErrorMessage(result?.error || t("orders.orderFailed"))
        setErrorDialogOpen(true)
        return
      }

      // Payme to'lov - redirect to Payme checkout page
      if (result.data?.payme?.paymentUrl) {
        console.log("[checkout] Redirecting to Payme:", result.data.payme.paymentUrl)
        clearCart()
        resetCheckout()
        window.location.href = result.data.payme.paymentUrl
        return
      }

      // Cash to'lov - success sahifasiga yo'naltirish
      setOrders([...orders, result.data])
      clearCart()
      resetCheckout()

      const nextParams = new URLSearchParams()
      nextParams.set("status", "success")
      if (gender) {
        nextParams.set("gender", gender)
      }
      router.push(`/confirm-order?${nextParams.toString()}`)
    })
  }, [user, items, totals, checkoutState, clearCart, resetCheckout, router, gender])

  const handleLoginRedirect = useCallback(() => {
    setLoginDialogOpen(false)
    router.push('/login')
  }, [router])

  return (
    <>
      <div className='flex-1'>
        <div className='relative flex flex-col justify-center items-center overflow-visible max-w-xl w-full'>
          <div className='w-full rounded-2xl bg-white/95 dark:bg-[#0b0b0b]/90 border border-black/5 dark:border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.15)]'>
            <div className='min-h-48 md:min-h-[380px] max-w-xl w-full p-5 rounded-t-2xl space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <h1 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>{t("orders.cart")}</h1>
                  <p className='text-sm text-muted-foreground'>
                    {items.length} {t("common.items")} · {totals.amount.toLocaleString()} {totals.currency}
                  </p>
                </div>
                <Image src="/icons/file.svg" width={46} height={46} alt="file" className='opacity-70 dark:opacity-90' />
              </div>
              <div className='max-h-48 md:max-h-[260px] overflow-y-auto custom-scroll rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161616]'>
                {items.length === 0 ? (
                  <p className='text-sm text-muted-foreground text-center py-6'>{t("orders.cartEmpty")}</p>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-white/10">
                    {items.map((item) => (
                      <div className='flex justify-between items-center gap-2 px-3 py-2.5' key={item.key}>
                        <div className='min-w-0 flex-1'>
                          <h1 className='text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-1'>
                            {item.name}
                          </h1>
                          {item.variantLabel && (
                            <span className='text-xs text-primary'>{item.variantLabel}</span>
                          )}
                          <p className='text-xs text-muted-foreground'>
                            {item.price.toLocaleString()} {item.currency} x {item.quantity}
                          </p>
                        </div>
                        <div className='flex items-center gap-2 shrink-0'>
                          <div className='flex items-center gap-1 bg-gray-100 dark:bg-white/10 rounded-lg p-0.5'>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.key, item.quantity - 1)}
                              className='w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-200 dark:hover:bg-white/20 transition-colors'
                            >
                              <Minus className='w-3.5 h-3.5' />
                            </button>
                            <span className='w-6 text-center text-sm font-semibold'>{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.key, item.quantity + 1)}
                              className='w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-200 dark:hover:bg-white/20 transition-colors'
                            >
                              <Plus className='w-3.5 h-3.5' />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.key)}
                            className='w-7 h-7 flex items-center justify-center rounded-md text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors'
                          >
                            <Trash2 className='w-3.5 h-3.5' />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className='border-t border-dashed border-gray-300 dark:border-white/15 mx-5'></div>

            <div className='flex justify-between items-center gap-3 max-w-xl w-full p-5 rounded-b-2xl'>
              <div>
                <h1 className='text-lg text-gray-700 dark:text-gray-300'>{t("orders.totalAmount")}</h1>
                <p className='text-3xl text-primary dark:text-white font-bold'>
                  {totals.amount.toLocaleString()} {totals.currency}
                </p>
              </div>
              <div className='text-sm text-muted-foreground text-right'>
                <p className='text-xs text-gray-500 dark:text-gray-400'>{t("common.quantity")}</p>
                <p className='text-base font-semibold text-gray-800 dark:text-gray-100'>{totals.quantity}</p>
              </div>
            </div>
          </div>
          <Button
            className='mt-4 w-full max-w-xl h-12 text-base rounded-2xl font-semibold'
            disabled={isPending || items.length === 0}
            onClick={handleSubmit}
          >
            {isPending ? t("orders.placingOrder") : t("orders.placeOrder")}
          </Button>
          <div className='absolute -z-10 w-24 h-6 bg-black/20 dark:bg-white/10 rounded-md -top-0 left-auto right-auto blur-md' />
        </div>
      </div>

      {/* Login Required Dialog */}
      <Dialog open={isLoginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className="w-full max-w-md rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#111]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t("orders.authRequired")}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-700 dark:text-gray-300 py-4">
            {t("orders.authRequiredDescription")}
          </p>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setLoginDialogOpen(false)}
              className="w-full sm:w-auto h-11 rounded-xl font-semibold"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleLoginRedirect}
              className="w-full sm:w-auto h-11 rounded-xl font-semibold"
            >
              {t("common.login")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <DialogContent className="w-full max-w-md rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#111]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t("orders.orderError")}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-700 dark:text-gray-300 py-4">
            {errorMessage}
          </p>
          <DialogFooter>
            <Button
              onClick={() => setErrorDialogOpen(false)}
              className="w-full h-11 rounded-xl font-semibold"
            >
              {t("common.ok")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
