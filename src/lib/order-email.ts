import { Resend } from "resend";
import type { StoredOrder } from "@/types";
import { formatCurrency, formatCpfDisplay, formatCepDisplay } from "@/lib/utils";

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      (
        {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        } as const
      )[character as "&" | "<" | ">" | '"' | "'"],
  );
}

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

function buildOrderEmailHtml(order: StoredOrder) {
  const itemsRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e8f4f7;color:#1a5f7a">${escapeHtml(item.name)} × ${item.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #e8f4f7;text-align:right;color:#1a5f7a">${formatCurrency(item.price * item.quantity)}</td>
      </tr>`,
    )
    .join("");

  const complement = order.address.complement
    ? ` — ${escapeHtml(order.address.complement)}`
    : "";

  const coupon = order.couponCode
    ? `<p style="margin:0 0 8px;color:#5a8a9a">Cupom: <strong style="color:#1a5f7a">${escapeHtml(order.couponCode)}</strong></p>`
    : "";

  return `
    <div style="background:#eef9fc;padding:40px 16px;font-family:Arial,sans-serif;color:#1a5f7a">
      <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #ade8f4;border-radius:24px;padding:32px">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#5bbcd6">Selavie Femme</p>
        <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-weight:400;font-size:28px">Pedido confirmado</h1>
        <p style="margin:0 0 24px;color:#5a8a9a">Pagamento aprovado. Seguem os dados do pedido <strong style="color:#1a5f7a">${escapeHtml(order.orderNumber)}</strong>.</p>

        <h2 style="margin:0 0 12px;font-size:16px;font-weight:600">Cliente</h2>
        <p style="margin:0 0 4px;color:#5a8a9a">${escapeHtml(order.customerName)}</p>
        <p style="margin:0 0 4px;color:#5a8a9a">CPF ${escapeHtml(formatCpfDisplay(order.customerCpf || ""))}</p>
        <p style="margin:0 0 4px;color:#5a8a9a">${escapeHtml(order.customerEmail)}</p>
        <p style="margin:0 0 20px;color:#5a8a9a">+55 ${escapeHtml(formatPhone(order.customerPhone))}</p>

        <h2 style="margin:0 0 12px;font-size:16px;font-weight:600">Entrega</h2>
        <p style="margin:0 0 4px;color:#5a8a9a">${escapeHtml(order.address.street)}, ${escapeHtml(order.address.number)}${complement}</p>
        <p style="margin:0 0 4px;color:#5a8a9a">${escapeHtml(order.address.district)} — ${escapeHtml(order.address.city)}/${escapeHtml(order.address.state)}</p>
        <p style="margin:0 0 4px;color:#5a8a9a">CEP ${escapeHtml(formatCepDisplay(order.address.zip))}</p>
        <p style="margin:0 0 20px;color:#5a8a9a">Frete: ${escapeHtml(order.shippingMethod)} (${formatCurrency(order.shippingPrice)})</p>

        <h2 style="margin:0 0 12px;font-size:16px;font-weight:600">Itens</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px">${itemsRows}</table>

        ${coupon}
        <p style="margin:0 0 4px;color:#5a8a9a">Subtotal: ${formatCurrency(order.subtotal)}</p>
        <p style="margin:0 0 4px;color:#5a8a9a">Desconto: ${formatCurrency(order.discount)}</p>
        <p style="margin:0 0 4px;color:#5a8a9a">Frete: ${formatCurrency(order.shippingPrice)}</p>
        <p style="margin:16px 0 0;font-size:18px;font-weight:600;color:#1a5f7a">Total: ${formatCurrency(order.total)}</p>
        <p style="margin:8px 0 0;color:#5a8a9a">Pagamento: ${order.paymentMethod === "PIX" ? "PIX" : "Cartão"} · Status: pago</p>
      </div>
    </div>
  `;
}

function buildOrderEmailText(order: StoredOrder) {
  const items = order.items
    .map(
      (item) =>
        `- ${item.name} × ${item.quantity}: ${formatCurrency(item.price * item.quantity)}`,
    )
    .join("\n");

  return [
    `Pedido ${order.orderNumber} confirmado — Selavie Femme`,
    "",
    `Cliente: ${order.customerName}`,
    `CPF: ${formatCpfDisplay(order.customerCpf || "")}`,
    `E-mail: ${order.customerEmail}`,
    `Telefone: +55 ${formatPhone(order.customerPhone)}`,
    "",
    `Endereço: ${order.address.street}, ${order.address.number}${order.address.complement ? ` — ${order.address.complement}` : ""}`,
    `${order.address.district} — ${order.address.city}/${order.address.state}`,
    `CEP ${formatCepDisplay(order.address.zip)}`,
    `Frete: ${order.shippingMethod} (${formatCurrency(order.shippingPrice)})`,
    "",
    "Itens:",
    items,
    "",
    order.couponCode ? `Cupom: ${order.couponCode}` : null,
    `Subtotal: ${formatCurrency(order.subtotal)}`,
    `Desconto: ${formatCurrency(order.discount)}`,
    `Frete: ${formatCurrency(order.shippingPrice)}`,
    `Total: ${formatCurrency(order.total)}`,
    `Pagamento: ${order.paymentMethod} — pago`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendOrderPaidEmails(order: StoredOrder) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    throw new Error("Resend não configurado para e-mail de pedido");
  }

  const resend = new Resend(apiKey);
  const subject = `Pedido ${order.orderNumber} confirmado — Selavie Femme`;
  const html = buildOrderEmailHtml(order);
  const text = buildOrderEmailText(order);

  const recipients = new Set<string>([
    order.customerEmail.toLowerCase(),
  ]);

  const notifyEmail = process.env.ORDER_NOTIFY_EMAIL?.trim();
  if (notifyEmail) {
    recipients.add(notifyEmail.toLowerCase());
  }

  const errors: string[] = [];
  for (const to of recipients) {
    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
    });
    if (error) errors.push(`${to}: ${error.message}`);
  }

  if (errors.length) {
    throw new Error(errors.join(" | "));
  }
}
