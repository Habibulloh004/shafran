"use client";

import React, { useCallback /*, useEffect, useMemo */ } from "react";
import { /* MapPin, */ Wallet, CreditCard, Smartphone, Check } from "lucide-react";
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
// import { useUserProfileStore } from "@/store/userProfileStore";
// import { adaptServerAddress } from "@/store/addressStore";

const FIELD_STYLES =
  "bg-white/95 dark:bg-[#111] border border-black/5 dark:border-white/10 text-sm text-foreground dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-500";

const CustomRadioItem = React.memo(
  ({ value, currentValue, onChange, icon: Icon, label, children }) => {
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
              <Icon
                className={cn(
                  "w-5 h-5 mr-2",
                  isActive
                    ? "text-primary"
                    : "text-gray-500 dark:text-gray-400"
                )}
              />
              {label}
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

export default function CheckoutForm() {
  const paymentMethod = useOrderStore((state) => state.paymentMethod);
  const selectedDigitalPayment = useOrderStore((state) => state.selectedDigitalPayment);
  const useBonus = useOrderStore((state) => state.useBonus);
  const bonusAmount = useOrderStore((state) => state.bonusAmount);
  const cardNumber = useOrderStore((state) => state.cardNumber);
  const expiry = useOrderStore((state) => state.expiry);
  const setPaymentMethod = useOrderStore((state) => state.setPaymentMethod);
  const setDigitalPayment = useOrderStore((state) => state.setDigitalPayment);
  const setUseBonus = useOrderStore((state) => state.setUseBonus);
  const setBonusAmount = useOrderStore((state) => state.setBonusAmount);
  const setCardNumber = useOrderStore((state) => state.setCardNumber);
  const setExpiry = useOrderStore((state) => state.setExpiry);

  const digitalPayments = [
    { id: "payme", name: "Payme" },
    { id: "click", name: "Click" },
    { id: "uzum", name: "Uzum" },
  ];

  const handleCardNumberChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, "");
    const formatted = value
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  }, [setCardNumber]);

  const handleExpiryChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      const formatted = value.replace(/(\d{2})(?=\d)/, "$1/");
      setExpiry(formatted);
    }
  }, [setExpiry]);

  return (
    <main className="flex-1 flex flex-col justify-start items-start">
      <div className="w-full max-w-xl bg-white/95 dark:bg-[#090909]/85 border border-black/5 dark:border-white/10 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.15)]">
        {/* TODO: Restore address feature when branches & delivery are enabled */}
        {/* 
        // --- ADDRESS BACKUP START ---
        <div className="px-4 pt-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Адрес доставки
          </h3>
          <div className="space-y-3">
            {addresses.length ? (
              addresses.map((address, idx) => {
                const addressId = address.id || `addr-${idx}`;
                return (
                  <label
                    key={addressId}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-2xl border border-black/5 dark:border-white/10 bg-white/95 dark:bg-[#181818] shadow-sm cursor-pointer transition-colors",
                      isAddressSelected(address) &&
                        "ring-1 ring-primary/40 dark:ring-primary/70"
                    )}
                  >
                    <Checkbox
                      id={`addr-${addressId}`}
                      checked={isAddressSelected(address)}
                      onCheckedChange={(checked) =>
                        checked && setSelectedAddress(address)
                      }
                    />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {address.label || "Адрес"}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {address.fullAddress || address.value || "Без адреса"}
                      </p>
                    </div>
                  </label>
                );
              })
            ) : (
              <p className="text-xs text-muted-foreground">
                Нет сохранённых адресов. Добавьте адрес в профиле.
              </p>
            )}
          </div>
        </div>
        // --- ADDRESS BACKUP END ---
        */}
        <div className="px-4 pt-4 pb-2" />

        <div className="px-4 pt-6">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Способ оплаты
          </h3>
          <div className="space-y-3">
            <CustomRadioItem
              value="cash"
              currentValue={paymentMethod}
              onChange={setPaymentMethod}
              icon={Wallet}
              label="Наличными"
            />

            <CustomRadioItem
              value="card"
              currentValue={paymentMethod}
              onChange={setPaymentMethod}
              icon={CreditCard}
              label="Пластиковая карта"
            >
              <div className="space-y-3">
                <div>
                  <Label
                    htmlFor="cardNumber"
                    className="text-xs text-gray-600 dark:text-gray-300"
                  >
                    Номер карты
                  </Label>
                  <Input
                    id="cardNumber"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    inputMode="numeric"
                    placeholder="1234 1234 1234 1234"
                    className={FIELD_STYLES}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="expiry"
                    className="text-xs text-gray-600 dark:text-gray-300"
                  >
                    Дата окончания
                  </Label>
                  <Input
                    id="expiry"
                    value={expiry}
                    onChange={handleExpiryChange}
                    inputMode="numeric"
                    placeholder="MM/YY"
                    className={FIELD_STYLES}
                  />
                </div>
              </div>
            </CustomRadioItem>

            <CustomRadioItem
              value="digital"
              currentValue={paymentMethod}
              onChange={setPaymentMethod}
              icon={Smartphone}
              label="Цифровые кошельки"
            >
              <div className="space-y-2">
                {digitalPayments.map((provider) => (
                  <label
                    key={provider.id}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200"
                  >
                    <Checkbox
                      id={`pay-${provider.id}`}
                      checked={selectedDigitalPayment === provider.id}
                      onCheckedChange={(checked) =>
                        checked && setDigitalPayment(checked ? provider.id : "")
                      }
                    />
                    {provider.name}
                  </label>
                ))}
              </div>
            </CustomRadioItem>
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
