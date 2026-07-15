import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createPixPayment } from "@/lib/pix";
import { saveOrder } from "@/lib/orders-store";
import { generateOrderNumber } from "@/lib/utils";
import type { CartItem, ShippingOption } from "@/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items = (body.items || []) as CartItem[];
    const shipping = body.shipping as ShippingOption;
    const customer = body.customer as {
      name: string;
      email: string;
      phone: string;
    };
    const address = body.address as {
      street: string;
      number: string;
      complement?: string;
      district: string;
      city: string;
      state: string;
      zip: string;
    };

    if (!items.length || !customer || !address || !shipping) {
      return NextResponse.json(
        { message: "Dados incompletos para checkout" },
        { status: 400 },
      );
    }

    const orderId = randomUUID();
    const orderNumber = generateOrderNumber();
    const subtotal = Number(body.subtotal || 0);
    const discount = Number(body.discount || 0);
    const total = Number(body.total || 0);

    const pix = await createPixPayment({
      amount: total,
      description: `Pedido ${orderNumber} - Selavie Femme`,
      payerEmail: customer.email,
      payerName: customer.name,
      orderId,
    });

    const order = await saveOrder({
      id: orderId,
      orderNumber,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      address,
      shippingMethod: shipping.name,
      shippingPrice: shipping.price,
      subtotal,
      discount,
      total,
      couponCode: body.couponCode || undefined,
      status: "PENDING",
      paymentMethod: "PIX",
      paymentStatus: "PENDING",
      pixCopyPaste: pix.copyPaste,
      pixQrCodeDataUrl: pix.qrCodeDataUrl,
      pixExpiresAt: pix.expiresAt,
      externalPaymentId: pix.paymentId,
      items,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      pixCopyPaste: pix.copyPaste,
      pixQrCodeDataUrl: pix.qrCodeDataUrl,
      pixExpiresAt: pix.expiresAt,
      provider: pix.provider,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao processar checkout" },
      { status: 500 },
    );
  }
}
