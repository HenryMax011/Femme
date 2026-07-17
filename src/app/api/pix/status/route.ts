import { NextResponse } from "next/server";
import { getOrderById, updateOrder } from "@/lib/orders-store";
import { getMercadoPagoPaymentStatus } from "@/lib/pix";
import { sendOrderPaidEmails } from "@/lib/order-email";
import type { StoredOrder } from "@/types";
import { z } from "zod";

const pixStatusSchema = z.object({
  orderId: z.string().min(1, "orderId obrigatório"),
});

const MOCK_APPROVE_AFTER_MS = 15_000;

async function markOrderPaid(orderId: string) {
  return updateOrder(orderId, {
    paymentStatus: "APPROVED",
    status: "PAID",
    approvedAt: new Date().toISOString(),
  });
}

async function ensureOrderPaidEmail(order: StoredOrder) {
  if (order.confirmationEmailSentAt || order.paymentStatus !== "APPROVED") {
    return order;
  }

  try {
    await sendOrderPaidEmails(order);
    return (
      (await updateOrder(order.id, {
        confirmationEmailSentAt: new Date().toISOString(),
      })) ?? order
    );
  } catch (error) {
    console.error("Erro ao enviar e-mail do pedido pago:", error);
    return order;
  }
}

export async function POST(req: Request) {
  const parsed = pixStatusSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "orderId obrigatório" }, { status: 400 });
  }

  const { orderId } = parsed.data;
  let order = await getOrderById(orderId);
  if (!order) {
    return NextResponse.json({ message: "Pedido não encontrado" }, { status: 404 });
  }

  if (order.paymentStatus === "APPROVED") {
    order = await ensureOrderPaidEmail(order);
    return NextResponse.json({
      paymentStatus: order.paymentStatus,
      status: order.status,
    });
  }

  const mpStatus = order.externalPaymentId
    ? await getMercadoPagoPaymentStatus(order.externalPaymentId)
    : null;

  if (mpStatus === "approved") {
    const updated = await markOrderPaid(orderId);
    if (updated) {
      order = await ensureOrderPaidEmail(updated);
    }
    return NextResponse.json({
      paymentStatus: order.paymentStatus,
      status: order.status,
    });
  }

  // Demo: aprova PIX direto após ~15s pelo createdAt no servidor
  const isDemoPayment =
    order.externalPaymentId?.startsWith("mock_") ||
    order.externalPaymentId?.startsWith("direct_");
  const createdAtMs = new Date(order.createdAt).getTime();
  const elapsedMs = Number.isFinite(createdAtMs)
    ? Date.now() - createdAtMs
    : 0;

  if (isDemoPayment && elapsedMs >= MOCK_APPROVE_AFTER_MS) {
    const updated = await markOrderPaid(orderId);
    if (updated) {
      order = await ensureOrderPaidEmail(updated);
    }
    return NextResponse.json({
      paymentStatus: order.paymentStatus,
      status: order.status,
    });
  }

  return NextResponse.json({
    paymentStatus: order.paymentStatus,
    status: order.status,
  });
}
