import { NextResponse } from "next/server";
import { getOrderById, updateOrder } from "@/lib/orders-store";
import { getMercadoPagoPaymentStatus } from "@/lib/pix";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  const elapsed = Number(searchParams.get("elapsed") || 0);

  if (!orderId) {
    return NextResponse.json({ message: "orderId obrigatório" }, { status: 400 });
  }

  const order = await getOrderById(orderId);
  if (!order) {
    return NextResponse.json({ message: "Pedido não encontrado" }, { status: 404 });
  }

  if (order.paymentStatus === "APPROVED") {
    return NextResponse.json({
      paymentStatus: order.paymentStatus,
      status: order.status,
    });
  }

  const mpStatus = order.externalPaymentId
    ? await getMercadoPagoPaymentStatus(order.externalPaymentId)
    : null;

  if (mpStatus === "approved") {
    const updated = await updateOrder(orderId, {
      paymentStatus: "APPROVED",
      status: "PAID",
      approvedAt: new Date().toISOString(),
    });
    return NextResponse.json({
      paymentStatus: updated?.paymentStatus,
      status: updated?.status,
    });
  }

  // Demo mode: auto-approve after ~15s when using mock PIX
  const isMock = order.externalPaymentId?.startsWith("mock_");
  if (isMock && elapsed >= 15) {
    const updated = await updateOrder(orderId, {
      paymentStatus: "APPROVED",
      status: "PAID",
      approvedAt: new Date().toISOString(),
    });
    return NextResponse.json({
      paymentStatus: updated?.paymentStatus,
      status: updated?.status,
    });
  }

  return NextResponse.json({
    paymentStatus: order.paymentStatus,
    status: order.status,
  });
}
