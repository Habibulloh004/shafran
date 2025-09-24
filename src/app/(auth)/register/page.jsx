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
    name: z
      .string()
      .min(3, { message: "Имя обязательно." }),
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
      name:"",
      password: "",
    },
  });

  const onSubmit = async () => {

  }

  return (
    <div className="
         relative
         w-full min-h-screen
         flex justify-center items-start
         overflow-hidden
         before:absolute before:inset-0
         before:bg-[url(/img/gul.webp)]
         before:bg-no-repeat before:bg-cover before:bg-[center_70%]
         before:brightness-150
         before:blur-[5px]
         before:scale-105
         before:-z-1
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
          <div className="flex justify-center items-center gap-4 flex-col px-6 py-4 backdrop-blur-sm shadow-[0px_0px_21.6px_-7px_#966877] w-full md:w-2/3 lg:w-10/12 xl:w-3/4 2xl:w-2/3  rounded-[10px] min-h-56 bg-[#151515BF]">
            <h1 className="text-2xl text-white">Регистрация</h1>
            <p className="text-white/30">Заполните все поля чтобы создать аккаунт</p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4 sm:space-y-5 md:space-y-6"
              >
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="name"
                  placeholder={"Ваше имя"}
                  label={"Имя"}
                  inputClass="text-foreground rounded-md border-[1px] h-10 sm:h-11 md:h-12 w-full px-3 sm:px-4"
                  disabled={isLoading}
                />
                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="phone"
                  placeholder={"Enter phone"}
                  label={"Номер телефона"}
                  inputClass="text-foreground w-full"
                  disabled={isLoading}
                />

                <div className="flex gap-4">
                  <CustomFormField
                    fieldType={FormFieldType.PASSWORDINPUT}
                    control={form.control}
                    name="password"
                    placeholder={"Пароль"}
                    label={"Пароль"}
                    inputClass="text-white rounded-md border-[1px] h-10 sm:h-11 md:h-12 w-full px-3 sm:px-4"
                    disabled={isLoading}
                  />
                  <CustomFormField
                    fieldType={FormFieldType.PASSWORDINPUT}
                    control={form.control}
                    name="password"
                    placeholder={"Пароль"}
                    label={"Подтвердите пароль"}
                    inputClass="text-white rounded-md border-[1px] h-10 sm:h-11 md:h-12 w-full px-3 sm:px-4"
                    disabled={isLoading}
                  />
                </div>

                <div className="w-full flex justify-center items-center flex-col gap-3 sm:gap-4">
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="
                    relative
                     before:absolute before:inset-0
                     before:bg-[url(/img/gul.webp)]
                     before:bg-no-repeat before:bg-cover before:bg-[center_70%]
                     before:brightness-150
                     before:blur-[5px]
                     before:scale-105
                     before:-z-1
                    text-white bg-transparent hover:bg-transparent cursor-pointer border border-input w-full p-2 sm:p-3 md:p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base transition-all duration-200"
                  >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isLoading ? "Submiting..." : "Регистрация"}
                  </button>

                  {/* Register Link */}
                  <p className="text-sm sm:text-base text-center text-gray-600">
                    Уже есть аккаунт? {" "}
                    <Link
                      href="/login"
                      className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
                    >
                      Войти
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
// import Image from "next/image";

// export default function RegisterPage() {
//   return (
//     <div
//       className="
//         relative
//         w-full min-h-screen
//         flex justify-center items-start
//         overflow-hidden
//         before:absolute before:inset-0
//         before:bg-[url(/img/gul.webp)]
//         before:bg-no-repeat before:bg-cover before:bg-[center_70%]
//         before:brightness-150
//         before:blur-[5px]
//         before:scale-105
//         before:z-0
//       "
//     >
//       {/* Content */}
//       <main className="relative z-10 max-w-[1440px] mx-auto flex flex-wrap w-full gap-3 justify-center items-start py-20 px-10">
//         <div className="gap-10 flex-col flex-1 flex justify-center items-center">
//           <Image
//             src={'/img/logoB.webp'}
//             alt="Logo"
//             width={300}
//             height={300}
//             loading="eager"
//             sizes="(max-width: 768px) 75vw, (max-width: 1200px) 50vw, 33vw"
//           />
//           <div className="backdrop-blur-sm shadow-[0px_0px_21.6px_-7px_#966877] w-2/3 rounded-[10px] p-2 min-h-56 bg-[#151515BF]">
//             Register form
//           </div>
//         </div>
//         <div className="flex-1 flex justify-center items-start">
//           <Image
//             src={"/img/logoDark.svg"}
//             alt="logo"
//             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//             width={400}
//             height={400}
//             loading="eager"
//           />
//         </div>
//       </main>
//     </div>
//   )
// }
