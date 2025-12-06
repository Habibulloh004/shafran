export function Price({
  amount = 0,
  currency = "USD",
  locale = "ru-RU",
  className = "",
}) {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "UZS" ? 0 : 2,
  });

  return (
    <div
      className={`flex items-start gap-1 text-xl md:text-2xl font-bold ${className}`}
    >
      <span>{formatter.format(amount)}</span>
    </div>
  );
}
