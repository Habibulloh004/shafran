"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useTranslation } from "@/i18n";

export default function BannerForm({ banner, onSubmit, onCancel, isLoading }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: banner?.title || "",
    url: banner?.url || "",
    image_light: banner?.image_light || "",
    image_dark: banner?.image_dark || "",
  });

  // Rasm qo'shish usuli: "url" yoki "upload"
  const [imageMethod, setImageMethod] = useState(null);
  const [uploadedLight, setUploadedLight] = useState(null);
  const [uploadedDark, setUploadedDark] = useState(null);
  const lightInputRef = useRef(null);
  const darkInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "light") {
        setUploadedLight(reader.result);
        setFormData((prev) => ({ ...prev, image_light: reader.result }));
      } else {
        setUploadedDark(reader.result);
        setFormData((prev) => ({ ...prev, image_dark: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const resetImageMethod = () => {
    setImageMethod(null);
    setUploadedLight(null);
    setUploadedDark(null);
    setFormData((prev) => ({
      ...prev,
      image_light: banner?.image_light || "",
      image_dark: banner?.image_dark || "",
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">{t("admin.bannerName")}</Label>
        <Input
          id="title"
          name="title"
          placeholder={t("admin.bannerNamePlaceholder")}
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      {/* URL */}
      <div className="space-y-2">
        <Label htmlFor="url">{t("admin.bannerUrl")}</Label>
        <Input
          id="url"
          name="url"
          type="url"
          placeholder={t("admin.bannerUrlPlaceholder")}
          value={formData.url}
          onChange={handleChange}
        />
        <p className="text-xs text-muted-foreground">
          {t("admin.bannerUrlHint")}
        </p>
      </div>

      {/* Image Method Selection */}
      <div className="space-y-4">
        <Label>{t("admin.imageMethod")}</Label>

        {imageMethod === null && (
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setImageMethod("url")}
              className="flex-1 h-auto py-4 flex-col gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>{t("admin.viaUrl")}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setImageMethod("upload")}
              className="flex-1 h-auto py-4 flex-col gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{t("admin.uploadImage")}</span>
            </Button>
          </div>
        )}

        {/* URL Method */}
        {imageMethod === "url" && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t("admin.addViaUrl")}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetImageMethod}
              >
                {t("common.cancel")}
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_light">{t("admin.lightModeImage")}</Label>
              <Input
                id="image_light"
                name="image_light"
                type="url"
                placeholder="https://example.com/image-light.jpg"
                value={formData.image_light}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_dark">{t("admin.darkModeImage")}</Label>
              <Input
                id="image_dark"
                name="image_dark"
                type="url"
                placeholder="https://example.com/image-dark.jpg"
                value={formData.image_dark}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">
                {t("admin.darkModeOptional")}
              </p>
            </div>

            {/* Preview */}
            {formData.image_light && (
              <div className="space-y-2">
                <Label>{t("admin.preview")}</Label>
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={formData.image_light}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Upload Method */}
        {imageMethod === "upload" && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t("admin.uploadImage")}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetImageMethod}
              >
                {t("common.cancel")}
              </Button>
            </div>

            {/* Light mode upload */}
            <div className="space-y-2">
              <Label>{t("admin.lightModeUpload")}</Label>
              <input
                ref={lightInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "light")}
                className="hidden"
              />
              {uploadedLight ? (
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={uploadedLight}
                    alt="Light preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-2 right-2"
                    onClick={() => lightInputRef.current?.click()}
                  >
                    {t("admin.change")}
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => lightInputRef.current?.click()}
                  className="w-full aspect-[16/9] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors"
                >
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm text-muted-foreground">{t("admin.uploadImage")}</span>
                </button>
              )}
            </div>

            {/* Dark mode upload */}
            <div className="space-y-2">
              <Label>{t("admin.darkModeUpload")}</Label>
              <input
                ref={darkInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "dark")}
                className="hidden"
              />
              {uploadedDark ? (
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={uploadedDark}
                    alt="Dark preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-2 right-2"
                    onClick={() => darkInputRef.current?.click()}
                  >
                    {t("admin.change")}
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => darkInputRef.current?.click()}
                  className="w-full h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors"
                >
                  <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs text-muted-foreground">{t("admin.darkModeUploadHint")}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          {t("common.cancel")}
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !formData.title}
          className="flex-1"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t("common.saving")}
            </span>
          ) : banner ? (
            t("common.save")
          ) : (
            t("admin.add")
          )}
        </Button>
      </div>
    </form>
  );
}
