"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiGet, apiPut } from "@/lib/api/client";
import { toast } from "sonner";
import { useTranslation } from "@/i18n";

export default function FooterSettingsPage() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await apiGet("/api/footer");
        setSettings(data?.data || {});
      } catch (error) {
        console.error(t("admin.footerLoadError"), error);
        setSettings({});
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggle = (field) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await apiPut("/api/footer", { body: settings });
      if (result?.success) {
        toast.success(t("admin.footerSaved"));
      } else {
        toast.error(t("admin.footerSaveError"));
      }
    } catch (error) {
      console.error(t("admin.footerLoadError"), error);
      toast.error(t("errors.networkError"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">{t("admin.footerSettings")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("admin.manageFooter")}
        </p>
      </div>

      {/* Contact Info */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="font-medium text-foreground">{t("admin.contactInfo")}</h3>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">{t("admin.addressField")}</label>
            <Input
              value={settings?.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder={t("admin.addressPlaceholder")}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">{t("admin.phone1")}</label>
              <Input
                value={settings?.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder={t("admin.phonePlaceholder")}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">{t("admin.phone2")}</label>
              <Input
                value={settings?.phone2 || ""}
                onChange={(e) => handleChange("phone2", e.target.value)}
                placeholder={t("admin.phonePlaceholder")}
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">{t("admin.emailField")}</label>
            <Input
              value={settings?.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder={t("admin.emailPlaceholder")}
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">{t("admin.workingHours")}</label>
            <Input
              value={settings?.working_hours || ""}
              onChange={(e) => handleChange("working_hours", e.target.value)}
              placeholder={t("admin.workingHoursPlaceholder")}
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="font-medium text-foreground">{t("admin.socialNetworks")}</h3>

        <div className="space-y-3">
          {[
            { key: "telegram", label: "Telegram", enabledKey: "telegram_enabled" },
            { key: "instagram", label: "Instagram", enabledKey: "instagram_enabled" },
            { key: "facebook", label: "Facebook", enabledKey: "facebook_enabled" },
            { key: "youtube", label: "YouTube", enabledKey: "youtube_enabled" },
            { key: "twitter", label: "Twitter / X", enabledKey: "twitter_enabled" },
            { key: "tiktok", label: "TikTok", enabledKey: "tiktok_enabled" },
          ].map(({ key, label, enabledKey }) => (
            <div key={key} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleToggle(enabledKey)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                  settings?.[enabledKey] ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings?.[enabledKey] ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <div className="flex-1">
                <label className="text-sm text-muted-foreground mb-1 block">{label}</label>
                <Input
                  value={settings?.[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={`https://${key === "telegram" ? "t.me/shafran" : key + ".com/shafran"}`}
                  disabled={!settings?.[enabledKey]}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="font-medium text-foreground">{t("admin.additional")}</h3>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">{t("admin.copyrightText")}</label>
          <Input
            value={settings?.copyright_text || ""}
            onChange={(e) => handleChange("copyright_text", e.target.value)}
            placeholder={t("admin.copyrightPlaceholder")}
          />
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {t("common.saving")}
            </>
          ) : (
            t("common.save")
          )}
        </Button>
      </div>
    </div>
  );
}
