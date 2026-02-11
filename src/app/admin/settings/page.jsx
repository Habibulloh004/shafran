"use client";

import { useState } from "react";
import { useAdminStore } from "@/store/adminStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTranslation } from "@/i18n";

export default function SettingsPage() {
  const { t } = useTranslation();
  const admin = useAdminStore((state) => state.admin);
  const credentials = useAdminStore((state) => state.credentials);
  const changePassword = useAdminStore((state) => state.changePassword);
  const changeUsername = useAdminStore((state) => state.changeUsername);

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Username form
  const [usernameForm, setUsernameForm] = useState({
    newUsername: credentials?.username || "",
    password: "",
  });

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error(t("admin.passwordsMismatch"));
      return;
    }

    if (passwordForm.newPassword.length < 4) {
      toast.error(t("admin.passwordTooShort"));
      return;
    }

    const result = changePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword
    );

    if (result.success) {
      toast.success(result.message);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      toast.error(result.error);
    }
  };

  const handleUsernameChange = (e) => {
    e.preventDefault();

    if (usernameForm.newUsername.length < 3) {
      toast.error(t("admin.usernameTooShort"));
      return;
    }

    const result = changeUsername(
      usernameForm.password,
      usernameForm.newUsername
    );

    if (result.success) {
      toast.success(result.message);
      setUsernameForm({
        ...usernameForm,
        password: "",
      });
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">{t("admin.settings")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("admin.manageSettings")}
        </p>
      </div>

      {/* Current Info */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-medium text-foreground mb-4">{t("admin.currentInfo")}</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">{t("admin.username")}</span>
            <span className="font-medium text-foreground">
              {credentials?.username || "admin"}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">{t("admin.loginTime")}</span>
            <span className="text-foreground">
              {admin?.loginTime
                ? new Date(admin.loginTime).toLocaleString("uz-UZ")
                : "\u2014"}
            </span>
          </div>
        </div>
      </div>

      {/* Change Username */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-medium text-foreground mb-4">{t("admin.changeUsername")}</h3>
        <form onSubmit={handleUsernameChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newUsername">{t("admin.newUsername")}</Label>
            <Input
              id="newUsername"
              type="text"
              placeholder={t("admin.newUsername")}
              value={usernameForm.newUsername}
              onChange={(e) =>
                setUsernameForm({ ...usernameForm, newUsername: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="usernamePassword">{t("admin.currentPassword")}</Label>
            <Input
              id="usernamePassword"
              type="password"
              placeholder={t("admin.enterPasswordField")}
              value={usernameForm.password}
              onChange={(e) =>
                setUsernameForm({ ...usernameForm, password: e.target.value })
              }
              required
            />
          </div>

          <Button type="submit">{t("admin.changeUsername")}</Button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-medium text-foreground mb-4">{t("admin.changePassword")}</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">{t("admin.currentPassword")}</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder={t("admin.enterCurrentPassword")}
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">{t("admin.newPasswordField")}</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder={t("admin.enterNewPassword")}
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("admin.confirmNewPassword")}</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t("admin.reenterNewPassword")}
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
              required
            />
          </div>

          <Button type="submit">{t("admin.changePassword")}</Button>
        </form>
      </div>

      {/* Info Box */}
      <div className="bg-muted/50 border border-border rounded-xl p-4">
        <div className="flex gap-3">
          <svg
            className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-muted-foreground">
            <p>
              {t("admin.settingsInfo")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
