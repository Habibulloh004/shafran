"use client"

import CustomFormField, { FormFieldType } from "@/components/shared/customFormField";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const LoginValidation = z.object({
    phone: z
      .string()
      .min(13, { message: "Неверный номер телефона" })
      .max(14, { message: "Неверный номер телефона" }),

    password: z
      .string()
      .min(6, { message: "Password in 6 characters" }),
  });

  const form = useForm({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit = async () => {

  }

  return (
    <div className="
      w-full min-h-screen
      bg-scroll
      bg-[url(/img/login.webp)]
      bg-no-repeat
      bg-cover
      bg-[center_70%]
      brightness-150
      flex justify-center items-start
    ">
      <main className="max-w-[1440px] mx-auto flex flex-wrap w-full gap-3 justify-center items-start py-20 px-10">

        <div className="gap-10 flex-col flex-1 flex justify-center items-center">
          <Image
            src={"/img/logoB.webp"}
            alt="Logo"
            width={300}
            height={300}
            loading="eager"
            sizes="(max-width: 768px) 75vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="w-full md:w-2/3 lg:w-10/12 xl:w-3/4 2xl:w-2/3 rounded-[10px] px-6 py-4 min-h-20 bg-[#151515BF] backdrop-blur-sm flex flex-col justify-centere items-center">
            <h1 className="text-2xl text-white">Войти</h1>
            <p className="text-white/30">Войдите в свой аккаунт</p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4 sm:space-y-5 md:space-y-6"
              >
                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="phone"
                  placeholder={"Enter phone"}
                  label={"Номер телефона"}
                  inputClass="text-foreground w-full"
                  disabled={isLoading}
                />

                <CustomFormField
                  fieldType={FormFieldType.PASSWORDINPUT}
                  control={form.control}
                  name="password"
                  placeholder={"Enter password"}
                  label={"Пароль"}
                  inputClass="text-foreground rounded-md border-[1px] h-10 sm:h-11 md:h-12 w-full px-3 sm:px-4"
                  disabled={isLoading}
                />

                <div className="w-full flex justify-center items-center flex-col gap-3 sm:gap-4">
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="
                     bg-[url(/img/login.webp)]
                     bg-no-repeat
                     bg-cover
                    text-white bg-primary hover:bg-primary/80 w-full p-2 sm:p-3 md:p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base transition-all duration-200"
                  >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isLoading ? "Submiting..." : "Войти"}
                  </button>

                  {/* Register Link */}
                  <p className="text-sm sm:text-base text-center text-gray-600">
                    Нету аккаунта? {" "}
                    <Link
                      href="/register"
                      className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
                    >
                      Регистрация
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>
        <div className="max-lg:hidden flex-1 flex justify-center items-start">
          <Image
            src={"/img/logoDark.svg"}
            alt="logo"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            width={400}
            height={400}
            className=""
            loading="eager"

          />
        </div>
      </main>
    </div>
  )
}
