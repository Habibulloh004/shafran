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
import { loginUser } from "actions/post";
import { useTranslation } from "@/i18n";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { t } = useTranslation();

  const LoginValidation = z.object({
    phone: z
      .string()
      .min(13, { message: t("auth.invalidPhone") })
      .max(14, { message: t("auth.invalidPhone") }),
    password: z
      .string()
      .min(1, { message: t("auth.enterPassword") }),
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
        setErrorMessage(response?.error || t("auth.loginFailed"));
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
        setErrorMessage(t("auth.invalidCredentials"));
        return;
      }

      const message =
        error?.details?.error?.message ||
        error?.message ||
        t("auth.loginError");
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
            <h1 className="text-2xl text-white">{t("auth.loginTitle")}</h1>
            <p className="text-white/30">{t("auth.loginSubtitle")}</p>
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
                  label={t("auth.phoneNumber")}
                  inputClass="text-white w-full"
                  disabled={isLoading}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="password"
                  placeholder={t("auth.enterPassword")}
                  label={t("auth.password")}
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
                    {isLoading ? t("common.submitting") : t("common.login")}
                  </button>

                  {/* Links */}
                  <div className="flex flex-col sm:flex-row gap-2 text-sm sm:text-base text-center text-gray-600">
                    <p>
                      {t("auth.noAccount")}{" "}
                      <Link
                        href="/register"
                        className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
                      >
                        {t("common.register")}
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
    </div>
  )
}
