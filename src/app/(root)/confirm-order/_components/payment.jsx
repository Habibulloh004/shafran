"use client";

import React, { useCallback } from "react";
import { Wallet, Check } from "lucide-react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useOrderStore } from "@/store/orderStore";
const paymeLogo = "/icons/payme.jpeg";

const FIELD_STYLES =
  "bg-white/95 dark:bg-[#111] border border-black/5 dark:border-white/10 text-sm text-foreground dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-500";

const CustomRadioItem = React.memo(
  ({ value, currentValue, onChange, icon: Icon, iconImage, label, children }) => {
    const isActive = value === currentValue;

    const handleChange = useCallback(() => {
      onChange(value);
    }, [onChange, value]);

    return (
      <Accordion type="single" collapsible value={isActive ? value : ""}>
        <AccordionItem
          value={value}
          className={cn(
            "border border-black/5 dark:border-white/10 rounded-2xl bg-white/95 dark:bg-[#181818] shadow-sm transition-colors",
            isActive && "ring-1 ring-primary/40 dark:ring-primary/70"
          )}
        >
          <div
            className="flex items-center px-4 py-3 cursor-pointer"
            onClick={handleChange}
          >
            <div
              className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center mr-3 transition-all",
                isActive
                  ? "bg-primary border-primary shadow-[0_0_12px_rgba(120,91,255,0.45)]"
                  : "border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700"
              )}
            >
              {isActive && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
            </div>
            <Label className="flex items-center cursor-pointer flex-1 text-sm text-gray-800 dark:text-gray-200 font-medium">
              {iconImage ? (
                <Image
                  src={iconImage}
                  alt={label}
                  width={80}
                  height={28}
                  className="mr-2 object-contain rounded-md"
                />
              ) : Icon ? (
                <Icon
                  className={cn(
                    "w-5 h-5 mr-2",
                    isActive
                      ? "text-primary"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                />
              ) : null}
              {!iconImage && label}
            </Label>
          </div>
          {children && (
            <AccordionContent className="pb-0">
              <div className="px-4 pb-4 space-y-3 bg-gray-50/90 dark:bg-white/5 border-t border-gray-200 dark:border-white/5 rounded-b-2xl">
                {children}
              </div>
            </AccordionContent>
          )}
        </AccordionItem>
      </Accordion>
    );
  }
);

CustomRadioItem.displayName = "CustomRadioItem";

export default function CheckoutForm() {
  const paymentMethod = useOrderStore((state) => state.paymentMethod);
  const useBonus = useOrderStore((state) => state.useBonus);
  const bonusAmount = useOrderStore((state) => state.bonusAmount);
  const setPaymentMethod = useOrderStore((state) => state.setPaymentMethod);
  const setUseBonus = useOrderStore((state) => state.setUseBonus);
  const setBonusAmount = useOrderStore((state) => state.setBonusAmount);

  return (
    <main className="flex-1 flex flex-col justify-start items-start">
      <div className="w-full max-w-xl bg-white/95 dark:bg-[#090909]/85 border border-black/5 dark:border-white/10 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.15)]">
        <div className="px-4 pt-4 pb-2" />

        <div className="px-4 pt-6">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Способ оплаты
          </h3>
          <div className="space-y-3">
            {/* Naqd pul */}
            <CustomRadioItem
              value="cash"
              currentValue={paymentMethod}
              onChange={setPaymentMethod}
              icon={Wallet}
              label="Наличными"
            />

            {/* Payme */}
            <CustomRadioItem
              value="payme"
              currentValue={paymentMethod}
              onChange={setPaymentMethod}
              iconImage={paymeLogo}
              label="Payme"
            />
          </div>
        </div>

        <div className="px-4 pt-6 pb-6 space-y-3">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
            <Checkbox
              checked={useBonus}
              onCheckedChange={setUseBonus}
              id="bonus-toggle"
            />
            Использовать бонус
          </label>
          {useBonus && (
            <Input
              value={bonusAmount}
              onChange={(e) => setBonusAmount(e.target.value)}
              className={FIELD_STYLES}
              placeholder="Сумма бонуса"
            />
          )}
        </div>
      </div>
    </main>
  );
}
