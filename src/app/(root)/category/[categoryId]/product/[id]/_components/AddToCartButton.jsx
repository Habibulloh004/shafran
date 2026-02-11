'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/store/orderStore";
import { useTranslation } from "@/i18n";

export default function AddToCartButton({
  product,
  variant,
  className,
  children,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useOrderStore((state) => state.addItem);
  const { t } = useTranslation();

  const handleClick = () => {
    if (!product || isAdding) return;
    setIsAdding(true);
    addItem(product, { quantity: 1, variant });
    setTimeout(() => setIsAdding(false), 700);
  };

  const renderContent = () => {
    if (!children) {
      return isAdding ? t("common.added") : t("common.addToCart");
    }

    if (typeof children === "function") {
      return children({ isAdding });
    }

    return children;
  };

  return (
    <Button
      type="button"
      className={className}
      onClick={handleClick}
      disabled={isAdding}
    >
      {renderContent()}
    </Button>
  );
}
