// components/shared/ErrorState.jsx
"use client";
import male from "@/assets/background/male.webp";
import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";
import CustomBackground from "./customBackground";
import { cn } from "@/lib/utils";

export default function ErrorState({ onRetry, showDetails = false, error }) {
  return (
    <CustomBackground
      singleImage={male}
      className="relative w-full md:min-h-screen flex flex-col justify-center items-center sm:gap-4 pt-12 sm:pt-24 pb-4"
      quality={100}
      type="single"
      classNameImage={cn(
        "opacity-20"
      )}
      priority
    >
      <div className="w-full max-w-lg text-center bg-white/80 backdrop-blur rounded-2xl border shadow p-8">
        <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-gray-600">
          ⚠️ Ошибка
        </span>

        <h1 className="mt-4 text-2xl font-semibold text-gray-900">
          Что-то пошло не так
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Произошла непредвиденная ошибка. Пожалуйста, попробуйте снова.
        </p>

        {showDetails && (
          <pre className="mt-4 text-xs text-left bg-gray-50 border rounded p-3 max-h-40 overflow-auto">
            {String(error?.message || error)}
          </pre>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {!!onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm text-white hover:bg-black"
            >
              <RefreshCw className="h-4 w-4" />
              Повторить
            </button>
          )}

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Home className="h-4 w-4" />
            На главную
          </Link>
        </div>
      </div>
    </CustomBackground>
  );
}
