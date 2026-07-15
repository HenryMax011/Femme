import QRCode from "qrcode";
import { randomUUID } from "crypto";

type PixCreateInput = {
  amount: number;
  description: string;
  payerEmail: string;
  payerName: string;
  orderId: string;
};

type PixCreateResult = {
  paymentId: string;
  copyPaste: string;
  qrCodeDataUrl: string;
  expiresAt: string;
  provider: "mercadopago" | "mock";
};

function buildMockPixPayload(amount: number, orderId: string) {
  const txid = orderId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 25).padEnd(25, "0");
  const value = amount.toFixed(2);
  // EMV-like demo payload — functional for QR generation & copy/paste UX
  return `00020126580014BR.GOV.BCB.PIX0136${txid}520400005303986540${value.length.toString().padStart(2, "0")}${value}5802BR5913SELAVIE FEMME6009SAO PAULO62070503***6304ABCD`;
}

async function createMercadoPagoPix(
  input: PixCreateInput,
): Promise<PixCreateResult | null> {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) return null;

  const res = await fetch("https://api.mercadopago.com/v1/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": input.orderId,
    },
    body: JSON.stringify({
      transaction_amount: Number(input.amount.toFixed(2)),
      description: input.description,
      payment_method_id: "pix",
      payer: {
        email: input.payerEmail,
        first_name: input.payerName.split(" ")[0],
        last_name: input.payerName.split(" ").slice(1).join(" ") || "Cliente",
      },
      metadata: { order_id: input.orderId },
    }),
  });

  if (!res.ok) {
    console.error("Mercado Pago PIX error", await res.text());
    return null;
  }

  const data = (await res.json()) as {
    id: number;
    point_of_interaction?: {
      transaction_data?: {
        qr_code?: string;
        qr_code_base64?: string;
      };
    };
    date_of_expiration?: string;
  };

  const copyPaste = data.point_of_interaction?.transaction_data?.qr_code;
  const base64 = data.point_of_interaction?.transaction_data?.qr_code_base64;

  if (!copyPaste) return null;

  return {
    paymentId: String(data.id),
    copyPaste,
    qrCodeDataUrl: base64
      ? `data:image/png;base64,${base64}`
      : await QRCode.toDataURL(copyPaste, { margin: 1, width: 280 }),
    expiresAt:
      data.date_of_expiration ||
      new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    provider: "mercadopago",
  };
}

export async function createPixPayment(
  input: PixCreateInput,
): Promise<PixCreateResult> {
  const mp = await createMercadoPagoPix(input);
  if (mp) return mp;

  const copyPaste = buildMockPixPayload(input.amount, input.orderId);
  const qrCodeDataUrl = await QRCode.toDataURL(copyPaste, {
    margin: 1,
    width: 280,
    color: { dark: "#1a2332", light: "#ffffff" },
  });

  return {
    paymentId: `mock_${randomUUID()}`,
    copyPaste,
    qrCodeDataUrl,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    provider: "mock",
  };
}

export async function getMercadoPagoPaymentStatus(paymentId: string) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token || paymentId.startsWith("mock_")) return null;

  const res = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  if (!res.ok) return null;
  const data = (await res.json()) as { status: string };
  return data.status;
}
