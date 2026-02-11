"use client";

import { useTranslation } from "@/i18n";

export default function OrderConfirmationTitle() {
  const { t } = useTranslation();

  return (
    <h1 className="text-lg md:text-2xl font-bold">
      {t("orders.orderConfirmation")}
    </h1>
  );
}
