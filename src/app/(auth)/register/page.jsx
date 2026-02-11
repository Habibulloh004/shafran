"use client";

import CustomFormField, {
  FormFieldType,
} from "@/components/shared/customFormField";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "actions/post";
import { useTranslation } from "@/i18n";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { t } = useTranslation();

  const RegisterSchema = z.object({
    first_name: z
      .string()
      .min(2, { message: t("auth.firstNameRequired") }),
    last_name: z
      .string()
      .min(2, { message: t("auth.lastNameRequired") }),
    phone_number: z
      .string()
      .min(13, { message: t("auth.invalidPhone") })
      .max(14, { message: t("auth.invalidPhone") }),
    password: z
      .string()
      .min(6, { message: t("auth.passwordMinLength") }),
    date_of_birth: z.string().refine((value) => {
      if (!value) return false;
      const date = new Date(value);
      return !Number.isNaN(date.getTime());
    }, t("auth.selectDateOfBirth")),
    gender: z.enum(["1", "2"], {
      errorMap: () => ({
        message: t("auth.selectGenderError"),
      }),
    }),
  });

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      password: "",
      date_of_birth: "",
      gender: "",
    },
  });

  const onSubmit = async (values) => {
    setErrorMessage("");
    setIsLoading(true);
    console.log("Register form values:", values);
    try {
      const res = await registerUser({
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone_number,
        password: values.password,
        date_of_birth: values.date_of_birth,
        gender: Number(values.gender)
      });

      if (res.success) {
        router.push("/login");
      } else {
        throw new Error(res.error || 'Registration failed');
      }
    } catch (error) {
      console.error("Register error", error);
      const message =
        error?.details?.error?.message ||
        error?.message ||
        t("auth.registerFailed");
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="text-2xl text-white">{t("auth.registerTitle")}</h1>
            <p className="text-white/30">{t("auth.registerSubtitle")}</p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4 sm:space-y-5 md:space-y-6"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="first_name"
                    placeholder={t("auth.firstName")}
                    label={t("auth.firstName")}
                    inputClass="text-white rounded-md border-[1px] h-10 sm:h-11 md:h-12 w-full px-3 sm:px-4"
                    disabled={isLoading}
                  />

                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="last_name"
                    placeholder={t("auth.lastName")}
                    label={t("auth.lastName")}
                    inputClass="text-white rounded-md border-[1px] h-10 sm:h-11 md:h-12 w-full px-3 sm:px-4"
                    disabled={isLoading}
                  />
                </div>

                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="phone_number"
                  placeholder={t("auth.enterPhone")}
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

                <div className="flex flex-col sm:flex-row gap-4">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="date_of_birth"
                    placeholder={t("auth.dateOfBirth")}
                    label={t("auth.dateOfBirth")}
                    inputType="date"
                    inputClass="text-white rounded-md border-[1px] h-10 sm:h-11 md:h-12 w-full px-3 sm:px-4"
                    disabled={isLoading}
                  />

                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="gender"
                    placeholder={t("auth.selectGender")}
                    label={t("auth.gender")}
                    options={[
                      { value: "1", label: t("common.male") },
                      { value: "2", label: t("common.female") },
                    ]}
                    className="text-white h-10 sm:h-11 md:h-12 bg-transparent border [&>span]:text-white"
                    disabled={isLoading}
                  />
                </div>

                {errorMessage && (
                  <p className="text-sm text-red-400">{errorMessage}</p>
                )}

                <div className="w-full flex justify-center items-center flex-col gap-3 sm:gap-4">
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
                    {isLoading ? t("common.sending") : t("auth.registerTitle")}
                  </button>

                  <p className="text-sm sm:text-base text-center text-gray-300">
                    {t("auth.hasAccount")}{" "}
                    <Link
                      href="/login"
                      className="text-blue-400 hover:text-blue-300 hover:underline font-medium transition-colors"
                    >
                      {t("common.login")}
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
  );
}
