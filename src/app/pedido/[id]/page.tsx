import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/orders-store";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pedido",
  robots: { index: false, follow: false },
};

type Params = Promise<{ id: string }>;

export default async function OrderPage({ params }: { params: Params }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl text-ink">Pedido {order.orderNumber}</h1>
      <p className="mt-2 text-muted">
        Status: {order.status} · Pagamento: {order.paymentStatus}
      </p>

      <div className="mt-8 space-y-4 rounded-[1.75rem] border border-border bg-white/90 p-6">
        <div>
          <h2 className="font-semibold">Cliente</h2>
          <p className="text-sm text-muted">
            {order.customerName}
            <br />
            {order.customerEmail}
            <br />
            {order.customerPhone}
          </p>
        </div>
        <div>
          <h2 className="font-semibold">Entrega</h2>
          <p className="text-sm text-muted">
            {order.address.street}, {order.address.number}
            {order.address.complement ? ` - ${order.address.complement}` : ""}
            <br />
            {order.address.district} · {order.address.city}/{order.address.state}
            <br />
            CEP {order.address.zip}
            <br />
            {order.shippingMethod} · {formatCurrency(order.shippingPrice)}
          </p>
        </div>
        <div>
          <h2 className="font-semibold">Itens</h2>
          <ul className="mt-2 space-y-2 text-sm text-muted">
            {order.items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-3">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Desconto</span>
            <span>- {formatCurrency(order.discount)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
