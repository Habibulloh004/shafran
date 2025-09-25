export function Price({ amount }) {
  return (
    <div className="flex items-start gap-1 text-xl md:text-3xl font-bold">
      <span className="text-lg">$</span>
      <span>{amount}</span>
    </div>
  );
}