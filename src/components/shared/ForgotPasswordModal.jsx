"use client";

import { useCallback, useState, useTransition } from "react";
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
import { Loader2 } from "lucide-react";

export default function ForgotPasswordModal({ open, onOpenChange }) {
  const [contact, setContact] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState(null);
  const [isPending, startTransition] = useTransition();

  const resetState = useCallback(() => {
    setContact("");
    setReason("");
    setStatus(null);
  }, []);

  const handleClose = (nextOpen) => {
    onOpenChange?.(nextOpen);
    if (!nextOpen) {
      resetState();
    }
  };

  const handleSubmit = () => {
    if (!contact.trim()) {
      setStatus({ type: "error", message: "Введите телефон или email." });
      return;
    }

    setStatus(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/internal/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: contact.startsWith("+") ? contact.trim() : "",
            email: contact.includes("@") ? contact.trim() : "",
            note: reason.trim(),
          }),
        });

        const result = await response.json();
        if (!response.ok || !result?.success) {
          throw new Error(result?.error || "Не удалось отправить запрос.");
        }

        setStatus({
          type: "success",
          message: "Запрос отправлен. Мы свяжемся с вами.",
        });
        setTimeout(() => handleClose(false), 2000);
      } catch (error) {
        setStatus({
          type: "error",
          message: error?.message || "Не удалось отправить запрос.",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Забыли пароль?</DialogTitle>
          <DialogDescription>
            Укажите телефон или email, и мы отправим инструкции по восстановлению.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact-input">Телефон или email</Label>
            <Input
              id="contact-input"
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder="+998 90 123 45 67 или you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="additional-info">Дополнительная информация</Label>
            <Textarea
              id="additional-info"
              rows={3}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Расскажите, с какой учетной записью возникла проблема (необязательно)"
            />
          </div>
          {status && (
            <p
              className={`text-sm ${
                status.type === "success" ? "text-green-600" : "text-red-500"
              }`}
            >
              {status.message}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => handleClose(false)}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Отправляем...
              </>
            ) : (
              "Отправить"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
