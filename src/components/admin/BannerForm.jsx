"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import { useTranslation } from "@/i18n";
import { toast } from "sonner";

const LANGUAGES = [
  { code: "uz", flag: "🇺🇿", label: "O'zbekcha" },
  { code: "ru", flag: "🇷🇺", label: "Русский" },
  { code: "en", flag: "🇬🇧", label: "English" },
];

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_ORIGINAL_FILE_SIZE = 12 * 1024 * 1024; // 12MB
const TARGET_UPLOAD_SIZE = 900 * 1024; // ~900KB to avoid backend 413 limits
const MIN_QUALITY = 0.45;
const MAX_DIMENSION = 1920;

const backendUrl = (
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8082"
).replace(/\/+$/, "");

function getFullImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${backendUrl}${normalizedPath}`;
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image load failed"));
    };
    image.src = objectUrl;
  });
}

function canvasToBlob(canvas, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/webp", quality);
  });
}

async function optimizeImageForUpload(file) {
  if (file.size <= TARGET_UPLOAD_SIZE) return file;

  const image = await loadImageFromFile(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  let quality = 0.9;
  let blob = await canvasToBlob(canvas, quality);

  while (blob && blob.size > TARGET_UPLOAD_SIZE && quality > MIN_QUALITY) {
    quality -= 0.1;
    blob = await canvasToBlob(canvas, quality);
  }

  if (!blob) {
    throw new Error("Image compression failed");
  }

  if (blob.size > TARGET_UPLOAD_SIZE) {
    throw new Error("Compressed image is still too large");
  }

  const name = file.name.replace(/\.[^.]+$/, "") || "banner-image";
  return new File([blob], `${name}.webp`, { type: "image/webp" });
}

export default function BannerForm({ banner, onSubmit, onCancel, isLoading }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(banner?.title || "");
  const [url, setUrl] = useState(banner?.url || "");
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const [imageFiles, setImageFiles] = useState({ uz: null, ru: null, en: null });
  const [previews, setPreviews] = useState({
    uz: getFullImageUrl(banner?.image_uz),
    ru: getFullImageUrl(banner?.image_ru),
    en: getFullImageUrl(banner?.image_en),
  });

  const fileInputRefs = {
    uz: useRef(null),
    ru: useRef(null),
    en: useRef(null),
  };

  const handleFileChange = async (lang, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(t("admin.invalidFileType"));
      return;
    }

    if (file.size > MAX_ORIGINAL_FILE_SIZE) {
      toast.error("Image is too large. Max original size is 12MB.");
      return;
    }

    try {
      setIsProcessingImage(true);
      const optimizedFile = await optimizeImageForUpload(file);
      setImageFiles((prev) => ({ ...prev, [lang]: optimizedFile }));
      setPreviews((prev) => ({ ...prev, [lang]: URL.createObjectURL(optimizedFile) }));
    } catch (error) {
      console.error("Image optimization error:", error);
      toast.error("Image could not be optimized. Please choose a smaller file.");
      if (fileInputRefs[lang].current) {
        fileInputRefs[lang].current.value = "";
      }
    } finally {
      setIsProcessingImage(false);
    }
  };

  const removeImage = (lang) => {
    setImageFiles((prev) => ({ ...prev, [lang]: null }));
    setPreviews((prev) => ({ ...prev, [lang]: null }));
    if (fileInputRefs[lang].current) {
      fileInputRefs[lang].current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("url", url);

    for (const lang of ["uz", "ru", "en"]) {
      if (imageFiles[lang]) {
        formData.append(`image_${lang}`, imageFiles[lang]);
      }
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">{t("admin.bannerName")}</Label>
        <Input
          id="title"
          placeholder={t("admin.bannerNamePlaceholder")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* URL */}
      <div className="space-y-2">
        <Label htmlFor="url">{t("admin.bannerUrl")}</Label>
        <Input
          id="url"
          type="url"
          placeholder={t("admin.bannerUrlPlaceholder")}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          {t("admin.bannerUrlHint")}
        </p>
      </div>

      {/* Language Image Tabs */}
      <div className="space-y-3">
        <Label>{t("admin.languageImages")}</Label>

        <Tabs defaultValue="uz" className="w-full">
          <TabsList className="w-full">
            {LANGUAGES.map((lang) => (
              <TabsTrigger
                key={lang.code}
                value={lang.code}
                className="flex-1 gap-1.5"
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
                {previews[lang.code] && (
                  <span className="w-2 h-2 rounded-full bg-green-500 ml-1" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {LANGUAGES.map((lang) => (
            <TabsContent key={lang.code} value={lang.code}>
              <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {t(
                      `admin.image${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}`
                    )}
                  </span>
                  {lang.code !== "uz" && (
                    <p className="text-xs text-muted-foreground">
                      {t("admin.imageOptional")}
                    </p>
                  )}
                </div>

                <input
                  ref={fileInputRefs[lang.code]}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handleFileChange(lang.code, e)}
                  className="hidden"
                />

                {previews[lang.code] ? (
                  <div className="space-y-2">
                    <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={previews[lang.code]}
                        alt={`${lang.label} preview`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          fileInputRefs[lang.code].current?.click()
                        }
                      >
                        {t("admin.change")}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => removeImage(lang.code)}
                      >
                        {t("common.delete")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRefs[lang.code].current?.click()
                    }
                    className="w-full aspect-[16/9] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors"
                  >
                    <svg
                      className="w-8 h-8 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="text-sm text-muted-foreground">
                      {t("admin.uploadImageForLang")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      JPG, PNG, WEBP (auto-optimized for upload)
                    </span>
                  </button>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
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
          disabled={isLoading || isProcessingImage || !title.trim()}
          className="flex-1"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
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
