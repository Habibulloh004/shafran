"use client";
import famale from "@/assets/background/famale.webp";
import male from "@/assets/background/male.webp";
import Link from "next/link";
import { Home, RefreshCcw } from "lucide-react";
import CustomBackground from "./customBackground";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n";

export default function NotFound() {
  const { t } = useTranslation();
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
      <div className="w-full max-w-lg text-center bg-white/80 backdrop-blur-xl rounded-2xl border shadow-lg p-8 mx-auto">
        {/* Top label */}
        <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-gray-600">
          {t("errors.pageNotFound")}
        </span>

        {/* Title */}
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          {t("errors.notFoundTitle")}
        </h1>

        {/* Description */}
        <p className="mt-2 text-sm text-gray-600">
          {t("errors.notFoundDescription")}
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {/* Home button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm text-white hover:bg-black transition"
          >
            <Home className="h-4 w-4" />
            {t("common.home")}
          </Link>

          {/* Reload button */}
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            <RefreshCcw className="h-4 w-4" />
            {t("common.refresh")}
          </button>
        </div>
      </div>
    </CustomBackground>
  );
}
