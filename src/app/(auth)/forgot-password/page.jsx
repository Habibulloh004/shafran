"use client";

import CustomFormField, {
  FormFieldType,
} from "@/components/shared/customFormField";
import { Form } from "@/components/ui/form";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: phone, 2: code, 3: new password, 4: success
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [devCode, setDevCode] = useState("");
  const { t } = useTranslation();

  const PhoneSchema = z.object({
    phone: z
      .string()
      .min(13, { message: t("auth.invalidPhone") })
      .max(14, { message: t("auth.invalidPhone") }),
  });

  const CodeSchema = z.object({
    code: z
      .string()
      .length(6, { message: t("auth.codeMustBe6Digits") }),
  });

  const PasswordSchema = z
    .object({
      new_password: z
        .string()
        .min(6, { message: t("auth.passwordMinLength") }),
      confirm_password: z.string().min(1, { message: t("auth.confirmPasswordRequired") }),
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: t("auth.passwordsDoNotMatch"),
      path: ["confirm_password"],
    });

  const phoneForm = useForm({
    resolver: zodResolver(PhoneSchema),
    defaultValues: { phone: "" },
  });

  const codeForm = useForm({
    resolver: zodResolver(CodeSchema),
    defaultValues: { code: "" },
  });

  const passwordForm = useForm({
    resolver: zodResolver(PasswordSchema),
    defaultValues: { new_password: "", confirm_password: "" },
  });

  // Step 1: Submit phone number
  const onSubmitPhone = async (values) => {
    try {
      setErrorMessage("");
      setIsLoading(true);

      const response = await fetch("/api/internal/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request", phone: values.phone }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || t("auth.requestFailed"));
      }

      setResetToken(result.token);
      setSessionId(result.session_id || "");
      if (result.code) setDevCode(result.code);
      setStep(2);
    } catch (error) {
      setErrorMessage(error?.message || t("auth.genericError"));
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify code
  const onSubmitCode = async (values) => {
    try {
      setErrorMessage("");
      setIsLoading(true);

      const response = await fetch("/api/internal/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          token: resetToken,
          code: values.code,
          session_id: sessionId,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || t("auth.invalidCode"));
      }

      setResetToken(result.token);
      setStep(3);
    } catch (error) {
      setErrorMessage(error?.message || t("auth.genericError"));
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Set new password
  const onSubmitPassword = async (values) => {
    try {
      setErrorMessage("");
      setIsLoading(true);

      const response = await fetch("/api/internal/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset",
          token: resetToken,
          new_password: values.new_password,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || t("auth.passwordChangeFailed"));
      }

      setStep(4);
    } catch (error) {
      setErrorMessage(error?.message || t("auth.genericError"));
    } finally {
      setIsLoading(false);
    }
  };

  const stepTitles = {
    1: t("auth.forgotPasswordTitle"),
    2: t("auth.enterCode"),
    3: t("auth.newPassword"),
    4: t("auth.done"),
  };

  const stepDescriptions = {
    1: t("auth.enterPhoneForRecovery"),
    2: t("auth.enter6DigitCode"),
    3: t("auth.createNewPassword"),
    4: t("auth.passwordChanged"),
  };

  return (
    <div
      className="
        w-full min-h-screen
        bg-scroll
        bg-[url(/img/login.webp)]
        bg-no-repeat
        bg-cover
        bg-[center_70%]
        brightness-150
        flex justify-center items-start
      "
    >
      <main className="max-w-[1440px] mx-auto flex flex-wrap w-full gap-3 justify-center items-start py-20 px-10">
        <div className="gap-10 flex-col flex-1 flex justify-center items-center">
          <Image
            src="/img/logoB.webp"
            alt="Logo"
            width={300}
            height={300}
            loading="eager"
            sizes="(max-width: 768px) 75vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="w-full md:w-2/3 lg:w-10/12 xl:w-3/4 2xl:w-2/3 rounded-[10px] px-6 py-6 min-h-20 bg-[#151515BF] backdrop-blur-sm flex flex-col justify-center items-center">
            {/* Step indicator */}
            {step < 4 && (
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      s === step
                        ? "w-8 bg-blue-500"
                        : s < step
                          ? "w-8 bg-blue-500/50"
                          : "w-8 bg-white/20"
                    }`}
                  />
                ))}
              </div>
            )}

            <h1 className="text-2xl text-white">{stepTitles[step]}</h1>
            <p className="text-white/30 mb-4">{stepDescriptions[step]}</p>

            {/* Step 1: Phone */}
            {step === 1 && (
              <Form {...phoneForm}>
                <form
                  onSubmit={phoneForm.handleSubmit(onSubmitPhone)}
                  className="w-full space-y-4 sm:space-y-5"
                >
                  <CustomFormField
                    fieldType={FormFieldType.PHONE_INPUT}
                    control={phoneForm.control}
                    name="phone"
                    placeholder={t("auth.enterPhone")}
                    label={t("auth.phoneNumber")}
                    inputClass="text-white w-full"
                    disabled={isLoading}
                  />

                  {errorMessage && (
                    <p className="text-sm text-red-400 text-center">
                      {errorMessage}
                    </p>
                  )}

                  <div className="w-full flex justify-center items-center flex-col gap-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[url(/img/login.webp)] bg-no-repeat bg-cover text-white bg-primary hover:bg-primary/80 w-full p-2 sm:p-3 md:p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base transition-all duration-200"
                    >
                      {isLoading && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      {isLoading ? t("common.sending") : t("auth.sendCode")}
                    </button>

                    <Link
                      href="/login"
                      className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {t("auth.backToLogin")}
                    </Link>
                  </div>
                </form>
              </Form>
            )}

            {/* Step 2: Code */}
            {step === 2 && (
              <Form {...codeForm}>
                <form
                  onSubmit={codeForm.handleSubmit(onSubmitCode)}
                  className="w-full space-y-4 sm:space-y-5"
                >
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={codeForm.control}
                    name="code"
                    placeholder="000000"
                    label={t("auth.confirmationCode")}
                    inputClass="text-white rounded-md border-[1px] h-10 sm:h-11 md:h-12 w-full px-3 sm:px-4 text-center tracking-[0.5em] text-lg"
                    disabled={isLoading}
                  />

                  {devCode && (
                    <p className="text-xs text-yellow-400/70 text-center">
                      {t("auth.devCode")}: {devCode}
                    </p>
                  )}

                  {errorMessage && (
                    <p className="text-sm text-red-400 text-center">
                      {errorMessage}
                    </p>
                  )}

                  <div className="w-full flex justify-center items-center flex-col gap-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[url(/img/login.webp)] bg-no-repeat bg-cover text-white bg-primary hover:bg-primary/80 w-full p-2 sm:p-3 md:p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base transition-all duration-200"
                    >
                      {isLoading && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      {isLoading ? t("auth.verifying") : t("auth.confirm")}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setErrorMessage("");
                        codeForm.reset();
                      }}
                      className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {t("auth.changeNumber")}
                    </button>
                  </div>
                </form>
              </Form>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
                  className="w-full space-y-4 sm:space-y-5"
                >
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={passwordForm.control}
                    name="new_password"
                    placeholder={t("auth.enterNewPassword")}
                    label={t("auth.newPassword")}
                    inputType="password"
                    inputClass="text-white rounded-md border-[1px] h-10 sm:h-11 md:h-12 w-full px-3 sm:px-4"
                    disabled={isLoading}
                  />

                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={passwordForm.control}
                    name="confirm_password"
                    placeholder={t("auth.repeatPassword")}
                    label={t("auth.confirmPassword")}
                    inputType="password"
                    inputClass="text-white rounded-md border-[1px] h-10 sm:h-11 md:h-12 w-full px-3 sm:px-4"
                    disabled={isLoading}
                  />

                  {errorMessage && (
                    <p className="text-sm text-red-400 text-center">
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[url(/img/login.webp)] bg-no-repeat bg-cover text-white bg-primary hover:bg-primary/80 w-full p-2 sm:p-3 md:p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base transition-all duration-200"
                  >
                    {isLoading && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {isLoading ? t("auth.saving") : t("auth.savePassword")}
                  </button>
                </form>
              </Form>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <div className="w-full flex flex-col items-center gap-4 py-4">
                <CheckCircle2 className="h-16 w-16 text-green-400" />
                <p className="text-white/70 text-center">
                  {t("auth.canLoginWithNewPassword")}
                </p>
                <button
                  onClick={() => router.push("/login")}
                  className="bg-[url(/img/login.webp)] bg-no-repeat bg-cover text-white bg-primary hover:bg-primary/80 w-full p-2 sm:p-3 md:p-2 rounded-md flex items-center justify-center gap-2 text-sm sm:text-base transition-all duration-200"
                >
                  {t("common.login")}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="max-lg:hidden flex-1 flex justify-center items-start">
          <Image
            src="/img/logoDark.svg"
            alt="logo"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            width={400}
            height={400}
            loading="eager"
          />
        </div>
      </main>
    </div>
  );
}
