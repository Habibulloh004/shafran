"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, LocateFixed } from "lucide-react";
import dynamic from "next/dynamic";

const LABEL_OPTIONS = [
  { value: "home", label: "Дом" },
  { value: "work", label: "Работа" },
  { value: "other", label: "Другое" },
];

const DEFAULT_COORDS = {
  lat: 41.2995,
  lng: 69.2401,
};

const MapPicker = dynamic(() => import("./MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
      <Loader2 className="animate-spin mr-2 h-4 w-4" />
      Загружаем карту...
    </div>
  ),
});

export default function AddAddressModal({
  open,
  onOpenChange,
  onSave,
  initialAddress = null,
}) {
  const [label, setLabel] = useState("home");
  const [fullAddress, setFullAddress] = useState("");
  const [coords, setCoords] = useState(DEFAULT_COORDS);
  const [isDefault, setIsDefault] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState(null);

  const canSave = useMemo(
    () => Boolean(coords?.lat && coords?.lng && fullAddress.trim().length > 0),
    [coords, fullAddress]
  );

  const resetState = useCallback(() => {
    setLabel("home");
    setFullAddress("");
    setCoords(DEFAULT_COORDS);
    setIsDefault(false);
    setIsSaving(false);
    setIsGeocoding(false);
    setIsDetecting(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open, resetState]);

  useEffect(() => {
    if (!open) return;
    if (initialAddress) {
      setLabel((initialAddress.label || "home").toLowerCase());
      setFullAddress(
        initialAddress.fullAddress ||
          initialAddress.formattedAddress ||
          initialAddress.value ||
          ""
      );
      setCoords({
        lat: initialAddress.latitude ?? DEFAULT_COORDS.lat,
        lng: initialAddress.longitude ?? DEFAULT_COORDS.lng,
      });
      setIsDefault(Boolean(initialAddress.isDefault));
    } else {
      resetState();
    }
  }, [open, initialAddress, resetState]);

  useEffect(() => {
    if (!coords?.lat || !coords?.lng) {
      return;
    }

    const controller = new AbortController();
    const lookup = async () => {
      setIsGeocoding(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          format: "jsonv2",
          lat: coords.lat,
          lon: coords.lng,
        });
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
          {
            headers: {
              "User-Agent": "shafran-app/1.0 (contact@shafran.local)",
            },
            signal: controller.signal,
          }
        );
        if (!response.ok) {
          throw new Error("Не удалось получить адрес.");
        }
        const data = await response.json();
        if (data?.display_name) {
          setFullAddress(data.display_name);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Reverse geocoding failed", err);
          setError("Не удалось определить адрес. Укажите вручную.");
        }
      } finally {
        setIsGeocoding(false);
      }
    };

    lookup();
    return () => controller.abort();
  }, [coords?.lat, coords?.lng]);

  const handleSave = async () => {
    if (!canSave || !onSave) return;
    setIsSaving(true);
    setError(null);
    try {
      await onSave({
        label,
        fullAddress: fullAddress.trim(),
        latitude: coords.lat,
        longitude: coords.lng,
        createdAt: new Date().toISOString(),
        isDefault,
        id: initialAddress?.id,
      });
      onOpenChange(false);
      resetState();
    } catch (err) {
      console.error("Failed to save address", err);
      setError(err?.message || "Не удалось сохранить адрес.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError("Браузер не поддерживает геолокацию.");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setError(null);
        setIsDetecting(false);
      },
      (geoError) => {
        console.error("Geolocation error", geoError);
        setError("Не удалось определить геолокацию.");
        setIsDetecting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>Добавить новый адрес</DialogTitle>
          <DialogDescription>
            Выберите точку на карте или укажите адрес вручную.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Тип адреса</Label>
              <Select value={label} onValueChange={setLabel}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  {LABEL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-6 md:pt-8">
              <Checkbox
                id="default-address"
                checked={isDefault}
                onCheckedChange={(checked) => setIsDefault(Boolean(checked))}
              />
              <Label htmlFor="default-address" className="cursor-pointer">
                Сделать адрес основным
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Полный адрес</Label>
            <Textarea
              rows={3}
              value={fullAddress}
              onChange={(event) => setFullAddress(event.target.value)}
              placeholder="Улица, дом, город, область"
            />
            {isGeocoding && (
              <p className="text-xs text-muted-foreground">
                Определяем адрес по координатам...
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Широта</Label>
              <Input value={coords?.lat || ""} readOnly />
            </div>
            <div className="space-y-1">
              <Label>Долгота</Label>
              <Input value={coords?.lng || ""} readOnly />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Локация</Label>
            <div className="flex justify-end pb-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDetectLocation}
                disabled={isDetecting}
                className="gap-2"
              >
                {isDetecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Определяем...
                  </>
                ) : (
                  <>
                    <LocateFixed className="h-4 w-4" />
                    Моя геолокация
                  </>
                )}
              </Button>
            </div>
            <div className="w-full h-72 rounded-xl border border-border overflow-hidden">
              {open && (
                <MapPicker center={coords} onSelect={setCoords} />
              )}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={!canSave || isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Сохраняем...
              </>
            ) : (
              "Сохранить адрес"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
