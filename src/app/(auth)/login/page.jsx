"use client"

import CustomFormField, { FormFieldType } from "@/components/shared/customFormField";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import ForgotPasswordModal from "@/components/shared/ForgotPasswordModal";
import { loginUser } from "actions/post";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isForgotModalOpen, setForgotModalOpen] = useState(false);
  const LoginValidation = z.object({
    phone: z
      .string()
      .min(13, { message: "Неверный номер телефона" })
      .max(14, { message: "Неверный номер телефона" }),
    password: z
      .string()
      .min(1, { message: "Введите пароль" }),
  });

  const form = useForm({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      setErrorMessage("");
      setIsLoading(true);

      const response = await loginUser({
        phone: values.phone,
        password: values.password,
      });
      console.log("Login response:", response);
      if (!response?.success || !response.data?.token) {
        setErrorMessage(response?.error || "Не удалось войти. Проверьте данные.");
        return;
      }

      // Set auth state in zustand store (cookie already set by server action)
      setAuth(response.data);

      // Refresh to ensure server components see the new cookie, then navigate
      router.refresh();
      router.push("/profile");
    } catch (error) {
      console.error("Login error", error);
      if (error?.status === 401 || error?.status === 404) {
        setErrorMessage("Неверный номер телефона или пароль.");
        return;
      }

      const message =
        error?.details?.error?.message ||
        error?.message ||
        "Не удалось войти. Попробуйте ещё раз.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
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
                  inputClass="text-white w-full"
                  disabled={isLoading}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="password"
                  placeholder={"Введите пароль"}
                  label={"Пароль"}
                  inputType="password"
                  inputClass="text-white rounded-md border-[1px] h-10 sm:h-11 md:h-12 w-full px-3 sm:px-4"
                  disabled={isLoading}
                />

                {errorMessage && (
                  <p className="text-sm text-red-400 text-center">{errorMessage}</p>
                )}

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

                  {/* Links */}
                  <div className="flex flex-col sm:flex-row gap-2 text-sm sm:text-base text-center text-gray-600">
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(true)}
                      className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
                    >
                      Забыли пароль?
                    </button>
                    <span className="hidden sm:inline">•</span>
                    <p>
                      Нет аккаунта?{" "}
                      <Link
                        href="/register"
                        className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
                      >
                        Регистрация
                      </Link>
                    </p>
                  </div>
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
      <ForgotPasswordModal open={isForgotModalOpen} onOpenChange={setForgotModalOpen} />
    </div>
  )
}
