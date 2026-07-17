"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy } from "lucide-react";

export function PixPayment({
  orderId,
  orderNumber,
  copyPaste,
  qrCodeDataUrl,
  expiresAt,
  onApproved,
}: {
  orderId: string;
  orderNumber: string;
  copyPaste: string;
  qrCodeDataUrl: string;
  expiresAt: string;
  onApproved: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("PENDING");
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const started = Date.now();
    const timer = setInterval(() => {
      setSeconds(Math.floor((Date.now() - started) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let approved = false;

    const poll = async () => {
      if (approved) return;
      const res = await fetch("/api/pix/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
        cache: "no-store",
      });
      const data = await res.json();
      if (cancelled) return;
      setStatus(data.paymentStatus);
      if (data.paymentStatus === "APPROVED") {
        approved = true;
        onApproved();
      }
    };

    const id = setInterval(poll, 3000);
    poll();
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [orderId, onApproved]);

  const copy = async () => {
    await navigator.clipboard.writeText(copyPaste);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 rounded-[1.75rem] border border-border bg-white/90 p-6">
      <div>
        <h2 className="font-display text-3xl">Pagamento via PIX</h2>
        <p className="mt-1 text-sm text-muted">
          Pedido {orderNumber} · Expira em{" "}
          {new Date(expiresAt).toLocaleTimeString("pt-BR")}
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-3xl bg-soft p-6">
        <Image
          src={qrCodeDataUrl}
          alt="QR Code PIX"
          width={240}
          height={240}
          unoptimized
          className="rounded-2xl bg-white p-2"
        />
        <p className="text-center text-sm text-muted">
          Escaneie o QR Code no app do seu banco
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Código copia e cola</p>
        <div className="break-all rounded-2xl border border-border bg-white px-3 py-3 text-xs text-muted">
          {copyPaste}
        </div>
        <Button variant="outline" className="w-full" onClick={copy}>
          <Copy className="h-4 w-4" />
          {copied ? "Copiado!" : "Copiar código PIX"}
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-soft px-4 py-3 text-sm">
        Status:{" "}
        <span className="font-semibold">
          {status === "APPROVED" ? "Aprovado" : "Aguardando pagamento"}
        </span>
        {status === "PENDING" ? (
          <p className="mt-1 text-xs text-muted">
            Atualização automática a cada 3s.
            {!process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
              ? " Em modo demonstração, o pagamento é aprovado em ~15 segundos."
              : null}
          </p>
        ) : (
          <p className="mt-2 inline-flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> Pagamento confirmado
          </p>
        )}
      </div>
    </div>
  );
}
