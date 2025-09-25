import React, { useState } from "react";
import { Star } from "lucide-react";

export default function StarRating({ max = 5, value = 0, onChange, readOnly = false }) {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex justify-start items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const ratingValue = i + 1;
        const filled = ratingValue <= (hover ?? value);

        return (
          <button
            key={i}
            type="button"
            onClick={() => {
              if (readOnly) return;
              onChange?.(ratingValue);
            }}
            onMouseEnter={() => {
              if (readOnly) return;
              setHover(ratingValue);
            }}
            onMouseLeave={() => {
              if (readOnly) return;
              setHover(null);
            }}
            className="p-0"
            style={{ cursor: readOnly ? "default" : "pointer" }}
            disabled={readOnly}
          >
            <Star
              className={`w-4 h-4 transition-colors ${
                filled ? "fill-[#F6B76F] text-[#F6B76F]" : "text-gray-400"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
