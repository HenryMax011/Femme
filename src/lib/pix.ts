import QRCode from "qrcode";
import { createHash, randomUUID } from "crypto";

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
  provider: "mercadopago" | "direct";
};

function emv(id: string, value: string) {
  const length = value.length.toString().padStart(2, "0");
  return `${id}${length}${value}`;
}

function crc16(payload: string) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i += 1) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
      else crc <<= 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function buildPixPayload(input: {
  key: string;
  merchantName: string;
  merchantCity: string;
  amount: number;
  txid: string;
}) {
  const amount = input.amount.toFixed(2);
  const merchantAccount = [
    emv("00", "br.gov.bcb.pix"),
    emv("01", input.key),
  ].join("");

  const additionalData = emv(
    "05",
    input.txid.replace(/[^a-zA-Z0-9]/g, "").slice(0, 25) || "***",
  );

  const partial = [
    emv("00", "01"),
    emv("26", merchantAccount),
    emv("52", "0000"),
    emv("53", "986"),
    emv("54", amount),
    emv("58", "BR"),
    emv("59", input.merchantName.slice(0, 25)),
    emv("60", input.merchantCity.slice(0, 15)),
    emv("62", additionalData),
    "6304",
  ].join("");

  return `${partial}${crc16(partial)}`;
}

function getPixReceiverKey() {
  return (
    process.env.PIX_KEY?.trim() ||
    process.env.PIX_RECEIVER_EMAIL?.trim() ||
    "henrymaximo099@gmail.com"
  );
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

  const pixKey = getPixReceiverKey();
  const txid = createHash("sha256")
    .update(input.orderId)
    .digest("hex")
    .slice(0, 25);

  const copyPaste = buildPixPayload({
    key: pixKey,
    merchantName: process.env.PIX_MERCHANT_NAME || "SELAVIE FEMME",
    merchantCity: process.env.PIX_MERCHANT_CITY || "SAO PAULO",
    amount: input.amount,
    txid,
  });

  const qrCodeDataUrl = await QRCode.toDataURL(copyPaste, {
    margin: 1,
    width: 280,
    color: { dark: "#1a2332", light: "#ffffff" },
  });

  return {
    paymentId: `direct_${randomUUID()}`,
    copyPaste,
    qrCodeDataUrl,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    provider: "direct",
  };
}

export async function getMercadoPagoPaymentStatus(paymentId: string) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token || paymentId.startsWith("mock_") || paymentId.startsWith("direct_")) {
    return null;
  }

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
