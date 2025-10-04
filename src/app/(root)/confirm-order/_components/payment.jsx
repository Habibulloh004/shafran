"use client";

import React, { useState, useCallback } from 'react';
import { ChevronDown, MapPin, Wallet, CreditCard, Smartphone, Store, Gift, Check } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

// Memoized CustomRadioItem to prevent unnecessary re-renders
const CustomRadioItem = React.memo(({ value, currentValue, onChange, icon: Icon, label, children }) => {
  const isActive = value === currentValue;

  // Use useCallback to memoize the onChange handler
  const handleChange = useCallback(() => {
    onChange(value);
  }, [onChange, value]);

  return (
    <div className="">
      <Accordion type="single" collapsible value={isActive ? value : ''} className="">
        <AccordionItem
          value={value}
          className={cn(
            "border rounded-none transition-all bg-white dark:bg-[#4B4B4B] border-none",
            isActive
              ? "border-primary/20 dark:border-primary"
              : "border-gray-200"
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
                  ? "bg-check-active border-check-active dark:bg-check-active dark:border-check-active"
                  : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
              )}
            >
              {isActive && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
            </div>
            <Label htmlFor={value} className="flex items-center cursor-pointer flex-1">
              <Icon className={`${isActive ? "text-check-active" : "text-gray-600 dark:text-white"} w-5 h-5 mr-2 `} />
              <span className={`${isActive ? "text-check-active" : "text-sm dark:text-gray-200"} `}>{label}</span>
            </Label>
            {isActive && children && <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />}
          </div>
          {children && (
            <AccordionContent className={"pb-0"}>
              <div className="bg-[#F2F2F296] px-4 py-2">{children}</div>
            </AccordionContent>
          )}
        </AccordionItem>
      </Accordion>
    </div>
  );
});

export default function CheckoutForm() {
  const [deliveryMethod, setDeliveryMethod] = useState('address');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedDigitalPayment, setSelectedDigitalPayment] = useState('');
  const [useBonus, setUseBonus] = useState(true);
  const [bonusAmount, setBonusAmount] = useState('50000');
  const [cardNumber, setCardNumber] = useState(''); // Controlled state for card number
  const [expiry, setExpiry] = useState(''); // Controlled state for expiry

  const addresses = [
    'Яшнабадский р-н, улица Боткина 5а',
    'Мирабадский р-н, улица Пушкина 12',
    'Чиланзарский р-н, улица Катартал 45'
  ];

  const branches = [
    'Филиал Юнусабад - ул. Бабура 12',
    'Филиал Чиланзар - ул. Катартал 34',
    'Филиал Сергели - ул. Янги Сергели 8'
  ];

  const digitalPayments = [
    { id: 'payme', name: 'Payme', color: 'bg-blue-500' },
    { id: 'click', name: 'Click', color: 'bg-purple-500' },
    { id: 'uzum', name: 'Uzum', color: 'bg-green-500' }
  ];

  // Handle card number input with formatting
  const handleCardNumberChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    const formatted = value
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, '$1 '); // Add space every 4 digits
    setCardNumber(formatted);
  }, []);

  // Handle expiry input with formatting
  const handleExpiryChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 4) {
      const formatted = value.replace(/(\d{2})(?=\d)/, '$1/');
      setExpiry(formatted);
    }
  }, []);

  return (
    <main className='flex-1 flex flex-col justify-start items-start'>
      <div className="w-full max-w-xl bg-transparent dark:bg-[#4B4B4B] rounded-lg">
        {/* Delivery Method */}
        <div className="">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 px-4 pt-4">Способ доставки</h3>

          <div>
            <CustomRadioItem
              value="address"
              currentValue={deliveryMethod}
              onChange={setDeliveryMethod}
              icon={MapPin}
              label="Адрес доставки"
            >
              <div className="space-y-2">
                <p className="text-xs text-gray-500 dark:text-black/90 mb-2">Выберите адрес:</p>
                {addresses.map((address, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <Checkbox
                      id={`addr-${idx}`}
                      checked={selectedAddress === address}
                      onCheckedChange={(checked) => checked && setSelectedAddress(address)}
                    />
                    <Label htmlFor={`addr-${idx}`} className="text-sm cursor-pointer dark:text-black/60">
                      {address}
                    </Label>
                  </div>
                ))}
              </div>
            </CustomRadioItem>

            <CustomRadioItem
              value="pickup"
              currentValue={deliveryMethod}
              onChange={setDeliveryMethod}
              icon={Store}
              label="Самовывоз"
            >
              <div className="space-y-2">
                <p className="text-xs text-gray-500 dark:text-black mb-2">Выберите филиал:</p>
                {branches.map((branch, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <Checkbox
                      id={`branch-${idx}`}
                      checked={selectedBranch === branch}
                      onCheckedChange={(checked) => checked && setSelectedBranch(branch)}
                    />
                    <Label htmlFor={`branch-${idx}`} className="text-sm cursor-pointer dark:text-black/60">
                      {branch}
                    </Label>
                  </div>
                ))}
              </div>
            </CustomRadioItem>
          </div>
        </div>

        {/* Payment Method */}
        <div className="pt-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Способ оплаты</h3>

          <div>
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
                  <Label htmlFor="cardNumber" className="text-xs text-gray-600 ">
                    Номер карты
                  </Label>
                  <Input
                    id="cardNumber"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 1234 1234 1234"
                    className="text-black p-0 leading-0.5 h-auto focus-visible:border-none focus-visible:ring-0 focus:ring-0 border-0 shadow-none rounded-none mt-1  dark:placeholder:text-gray-500"
                    maxLength={19}
                  />
                </div>
                <div>
                  <Label htmlFor="expiry" className="text-xs text-gray-600 ">
                    Дата окончания
                  </Label>
                  <Input
                    id="expiry"
                    value={expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    className="text-black text-xs p-0 w-16 mt-1  dark:placeholder:text-gray-500 leading-0.5 h-auto focus-visible:border-none focus-visible:ring-0 focus:ring-0 border-0 shadow-none rounded-none"
                    maxLength={5}
                  />
                </div>
              </div>
            </CustomRadioItem>

            <CustomRadioItem
              value="digital"
              currentValue={paymentMethod}
              onChange={setPaymentMethod}
              icon={Smartphone}
              label="Payme, Click, Uzum"
            >
              <div className="space-y-2">
                <p className="text-xs text-gray-500 dark:text-black/90 mb-3">Выберите платежную систему:</p>
                <div className="space-y-2">
                  {digitalPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`payment-${payment.id}`}
                        checked={selectedDigitalPayment === payment.id}
                        onCheckedChange={(checked) => checked && setSelectedDigitalPayment(payment.id)}
                      />
                      <Label
                        htmlFor={`payment-${payment.id}`}
                        className="flex items-center cursor-pointer flex-1"
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs mr-3",
                            payment.color
                          )}
                        >
                          {payment.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium dark:text-white/60">{payment.name}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CustomRadioItem>
          </div>
        </div>

        {/* Bonus */}
        <div
          className={cn(
            "border-none bg-white rounded-none p-4 transition-all",
            useBonus && "border-primary/10 dark:border-primary"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox
                id="bonus"
                checked={useBonus}
                onCheckedChange={setUseBonus}
              />
              <Label htmlFor="bonus" className="ml-2 flex items-center cursor-pointer">
                <Gift className="w-5 h-5 mr-2 text-gray-600 dark:text-white" />
                <span className="text-sm">Использовать бонус</span>
              </Label>
            </div>
            {useBonus && (
              <div className='flex justify-end items-center gap-2'>
                <Input
                  type="text"
                  value={bonusAmount}
                  onChange={(e) => setBonusAmount(e.target.value)}
                  className="h-auto p-0 shadow-none focus-visible:ring-0 focus-visible:border-none border-none rounded-none w-28 text-right dark:text-white/60 dark:placeholder:text-white/60"
                  placeholder="50 000"
                /> <span className="text-sm text-gray-600 dark:text-white/60"> сум</span>
              </div>
            )}
            {!useBonus && (
              <span className="text-sm text-gray-600 dark:text-white/60">{bonusAmount} сум</span>
            )}
          </div>
        </div>

      </div>
      {/* Submit Button */}
      <button className="max-w-xl w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
        Оформить заказ
      </button>
    </main>
  );
}