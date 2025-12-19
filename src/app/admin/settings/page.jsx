"use client";

import { useState } from "react";
import { useAdminStore } from "@/store/adminStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
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
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Username form
  const [usernameForm, setUsernameForm] = useState({
    newUsername: credentials?.username || "",
    password: "",
  });
  const [usernameError, setUsernameError] = useState("");
  const [usernameSuccess, setUsernameSuccess] = useState("");

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Yangi parollar mos kelmaydi");
      return;
    }

    if (passwordForm.newPassword.length < 4) {
      setPasswordError("Yangi parol kamida 4 ta belgi bo'lishi kerak");
      return;
    }

    const result = changePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword
    );

    if (result.success) {
      setPasswordSuccess(result.message);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      setPasswordError(result.error);
    }
  };

  const handleUsernameChange = (e) => {
    e.preventDefault();
    setUsernameError("");
    setUsernameSuccess("");

    if (usernameForm.newUsername.length < 3) {
      setUsernameError("Username kamida 3 ta belgi bo'lishi kerak");
      return;
    }

    const result = changeUsername(
      usernameForm.password,
      usernameForm.newUsername
    );

    if (result.success) {
      setUsernameSuccess(result.message);
      setUsernameForm({
        ...usernameForm,
        password: "",
      });
    } else {
      setUsernameError(result.error);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">Sozlamalar</h2>
        <p className="text-sm text-muted-foreground">
          Admin hisobingiz sozlamalarini boshqaring
        </p>
      </div>

      {/* Current Info */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-medium text-foreground mb-4">Joriy ma'lumotlar</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Username</span>
            <span className="font-medium text-foreground">
              {credentials?.username || "admin"}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Login vaqti</span>
            <span className="text-foreground">
              {admin?.loginTime
                ? new Date(admin.loginTime).toLocaleString("uz-UZ")
                : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Change Username */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-medium text-foreground mb-4">Username o'zgartirish</h3>
        <form onSubmit={handleUsernameChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newUsername">Yangi username</Label>
            <Input
              id="newUsername"
              type="text"
              placeholder="Yangi username"
              value={usernameForm.newUsername}
              onChange={(e) =>
                setUsernameForm({ ...usernameForm, newUsername: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="usernamePassword">Joriy parol</Label>
            <Input
              id="usernamePassword"
              type="password"
              placeholder="Parolni kiriting"
              value={usernameForm.password}
              onChange={(e) =>
                setUsernameForm({ ...usernameForm, password: e.target.value })
              }
              required
            />
          </div>

          {usernameError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3">
              {usernameError}
            </div>
          )}

          {usernameSuccess && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm rounded-lg p-3">
              {usernameSuccess}
            </div>
          )}

          <Button type="submit">Username o'zgartirish</Button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-medium text-foreground mb-4">Parol o'zgartirish</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Joriy parol</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Joriy parolni kiriting"
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
            <Label htmlFor="newPassword">Yangi parol</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Yangi parolni kiriting"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Yangi parolni tasdiqlash</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Yangi parolni qayta kiriting"
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

          {passwordError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3">
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm rounded-lg p-3">
              {passwordSuccess}
            </div>
          )}

          <Button type="submit">Parol o'zgartirish</Button>
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
              Ma'lumotlar brauzeringizning local storage'ida saqlanadi. Boshqa
              qurilmada kirganingizda default login/parol ishlatiladi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
