export function Price({
  amount = 0,
  currency = "USD",
  locale = "ru-RU",
  className = "",
  size = "default",
}) {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "UZS" ? 0 : 2,
  });

  const sizeClasses = {
    sm: "text-sm md:text-base",
    default: "text-base md:text-lg",
    lg: "text-xl md:text-2xl",
  };

  return (
    <div
      className={`flex items-start gap-1 font-bold ${sizeClasses[size] || sizeClasses.default} ${className}`}
    >
      <span>{formatter.format(amount)}</span>
    </div>
  );
}
