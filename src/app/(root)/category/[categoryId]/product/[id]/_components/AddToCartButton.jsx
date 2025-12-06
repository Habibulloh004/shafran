'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/store/orderStore";

export default function AddToCartButton({
  product,
  variant,
  className,
  children,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useOrderStore((state) => state.addItem);

  const handleClick = () => {
    if (!product || isAdding) return;
    setIsAdding(true);
    addItem(product, { quantity: 1, variant });
    setTimeout(() => setIsAdding(false), 700);
  };

  const renderContent = () => {
    if (!children) {
      return isAdding ? "Добавлено" : "В корзину";
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
