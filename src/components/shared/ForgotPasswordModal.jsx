"use client";

import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/i18n";

export default function ForgotPasswordModal({ open, onOpenChange }) {
  const [step, setStep] = useState(1); // 1: phone, 2: code, 3: new password, 4: success
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [devCode, setDevCode] = useState("");

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { t } = useTranslation();

  const resetState = useCallback(() => {
    setStep(1);
    setIsLoading(false);
    setErrorMessage("");
    setResetToken("");
    setSessionId("");
    setDevCode("");
    setPhone("");
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
  }, []);

  const handleClose = (nextOpen) => {
    onOpenChange?.(nextOpen);
    if (!nextOpen) {
      resetState();
    }
  };

  // Step 1: Submit phone
  const onSubmitPhone = async (e) => {
    e.preventDefault();
    if (!phone.trim() || phone.trim().length < 13) {
      setErrorMessage(t("auth.enterValidPhone"));
      return;
    }
    try {
      setErrorMessage("");
      setIsLoading(true);

      const response = await fetch("/api/internal/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request", phone: phone.trim() }),
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
  const onSubmitCode = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setErrorMessage(t("auth.codeMustBe6Digits"));
      return;
    }
    try {
      setErrorMessage("");
      setIsLoading(true);

      const response = await fetch("/api/internal/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          token: resetToken,
          code,
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
  const onSubmitPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMessage(t("auth.passwordMinLength"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage(t("auth.passwordsDoNotMatch"));
      return;
    }
    try {
      setErrorMessage("");
      setIsLoading(true);

      const response = await fetch("/api/internal/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset",
          token: resetToken,
          new_password: newPassword,
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>{stepTitles[step]}</DialogTitle>
          <DialogDescription>{stepDescriptions[step]}</DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        {step < 4 && (
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? "w-8 bg-blue-500"
                    : s < step
                      ? "w-8 bg-blue-500/50"
                      : "w-8 bg-muted"
                }`}
              />
            ))}
          </div>
        )}

        {/* Step 1: Phone */}
        {step === 1 && (
          <form onSubmit={onSubmitPhone} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-phone">{t("auth.phoneNumber")}</Label>
              <Input
                id="reset-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                disabled={isLoading}
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-red-500 text-center">{errorMessage}</p>
            )}

            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {t("common.sending")}
                  </>
                ) : (
                  t("auth.sendCode")
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Step 2: Code */}
        {step === 2 && (
          <form onSubmit={onSubmitCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-code">{t("auth.confirmationCode")}</Label>
              <Input
                id="reset-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="000000"
                className="text-center tracking-[0.5em] text-lg"
                maxLength={6}
                disabled={isLoading}
              />
            </div>

            {devCode && (
              <p className="text-xs text-yellow-500/70 text-center">
                {t("auth.devCode")}: {devCode}
              </p>
            )}

            {errorMessage && (
              <p className="text-sm text-red-500 text-center">{errorMessage}</p>
            )}

            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {t("auth.verifying")}
                  </>
                ) : (
                  t("auth.confirm")
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setStep(1);
                  setErrorMessage("");
                  setCode("");
                }}
                className="text-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t("auth.changeNumber")}
              </Button>
            </div>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={onSubmitPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-new-password">{t("auth.newPassword")}</Label>
              <Input
                id="reset-new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t("auth.enterNewPassword")}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reset-confirm-password">{t("auth.confirmPassword")}</Label>
              <Input
                id="reset-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("auth.repeatPassword")}
                disabled={isLoading}
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-red-500 text-center">{errorMessage}</p>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t("auth.saving")}
                </>
              ) : (
                t("auth.savePassword")
              )}
            </Button>
          </form>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="flex flex-col items-center gap-4 py-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <p className="text-sm text-muted-foreground text-center">
              {t("auth.canUseNewPassword")}
            </p>
            <Button onClick={() => handleClose(false)} className="w-full">
              {t("common.close")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
