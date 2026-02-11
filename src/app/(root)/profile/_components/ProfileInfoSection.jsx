'use client';

import React, { useEffect, useMemo, useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, User, Phone, Users } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateProfileDetails } from '../actions';
import { useRouter } from 'next/navigation';
import ForgotPasswordModal from '@/components/shared/ForgotPasswordModal';
import { useTranslation } from "@/i18n";

export default function ProfileInfoSection({ profile = {} }) {
  const router = useRouter();
  const [isForgotModalOpen, setForgotModalOpen] = useState(false);
  const [status, setStatus] = useState(null);
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();

  const initialForm = useMemo(
    () => ({
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      phone_number:
        profile?.phone_number ||
        profile?.phone_numbers?.[0] ||
        "",
      gender: profile?.gender
    }),
    [profile]
  );
  console.log({ profile })
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    setFormData(initialForm);
  }, [initialForm]);

  const normalizeGender = (gender) => {
    if (!gender) return "";
    return gender.toUpperCase();
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const hasChanges = useMemo(
    () =>
      Object.keys(initialForm).some(
        (key) => (formData[key] || "") !== (initialForm[key] || "")
      ),
    [formData, initialForm]
  );

  const showMessage = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 4000);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!hasChanges) return;
    setStatus(null);

    startTransition(async () => {
      const result = await updateProfileDetails(formData);
      if (result?.success) {
        showMessage("success", t("profile.profileUpdated"));
        router.refresh();
      } else {
        showMessage("error", result?.error || t("profile.profileUpdateFailed"));
      }
    });
  };

  const handleReset = () => {
    setFormData(initialForm);
    setStatus(null);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">{t("profile.profile")}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t("profile.updatePersonalInfo")}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="text-sm text-blue-600 hover:text-blue-700 hover:bg-transparent"
          onClick={() => setForgotModalOpen(true)}
        >
          {t("auth.forgotPassword")}
        </Button>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4 space-y-1">
          <CardTitle className="text-base sm:text-lg">{t("profile.personalInfo")}</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {t("profile.personalInfoDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="flex items-center gap-2 text-sm font-medium">
                  <User className="w-4 h-4 text-muted-foreground" />
                  {t("auth.firstName")}
                </Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={handleChange("first_name")}
                  placeholder={t("auth.firstName")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="flex items-center gap-2 text-sm font-medium">
                  <User className="w-4 h-4 text-muted-foreground" />
                  {t("auth.lastName")}
                </Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={handleChange("last_name")}
                  placeholder={t("auth.lastName")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_number" className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {t("common.phone")}
                </Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange("phone_number")}
                  placeholder="+998 90 123 45 67"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="flex items-center gap-2 text-sm font-medium">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  {t("auth.gender")}
                </Label>
                <Select
                  value={normalizeGender(formData.gender)}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("auth.selectGender")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">{t("common.male")}</SelectItem>
                    <SelectItem value="FEMALE">{t("common.female")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {status && (
              <p
                className={`text-sm ${status.type === "success" ? "text-green-600" : "text-red-500"
                  }`}
              >
                {status.message}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                disabled={!hasChanges || isPending}
                className="flex-1 sm:flex-none"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {t("common.saving")}
                  </>
                ) : (
                  t("profile.saveChanges")
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!hasChanges || isPending}
                onClick={handleReset}
                className="flex-1 sm:flex-none"
              >
                {t("common.cancel")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <ForgotPasswordModal open={isForgotModalOpen} onOpenChange={setForgotModalOpen} />
    </div>
  );
}
