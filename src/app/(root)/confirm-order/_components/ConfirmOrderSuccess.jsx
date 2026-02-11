"use client";

import Image from "next/image";
import Link from "next/link";
import { CircleCheck } from "lucide-react";
import logoDark from "@/assets/img/logoDark.svg";
import logoLight from "@/assets/img/logoLight.svg";
import { useTranslation } from "@/i18n";

export default function ConfirmOrderSuccess() {
  const { t } = useTranslation();

  return (
    <section className="containerCustom space-y-4 w-11/12 lg:w-10/12 xl:w-9/12 2xl:w-8/12 md:bg-white/75 dark:md:bg-black/30 rounded-2xl p-3 md:p-10 md:border border-[#E8EBF1] dark:border-[#E8EBF14D] md:shadow-[0px_16px_48px_0px_#FFFFFF] dark:shadow-none md:backdrop-blur-[100px]">
      <div className="flex flex-col items-center justify-center gap-6 py-8">
        <Image
          src={logoDark}
          alt="Shafran"
          width={120}
          height={40}
          className="hidden dark:block"
        />
        <Image
          src={logoLight}
          alt="Shafran"
          width={120}
          height={40}
          className="dark:hidden"
        />
        <CircleCheck className="w-16 h-16 text-green-500" />
        <div className="text-center space-y-2">
          <h1 className="text-xl md:text-2xl font-bold">
            {t("orders.orderAccepted")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("orders.managersWillContact")}
          </p>
        </div>
        <Link
          href="/"
          className="px-6 py-3 rounded-2xl bg-primary text-white hover:bg-primary/80 transition-colors font-semibold"
        >
          {t("common.homePage")}
        </Link>
      </div>
    </section>
  );
}
