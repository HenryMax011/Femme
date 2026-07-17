import { createHmac, randomInt } from "crypto";
import { Resend } from "resend";

const CODE_TTL_MINUTES = 10;

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

function getVerificationSecret() {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET não configurado");
  }
  return secret;
}

export function createVerificationCode() {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashVerificationCode(email: string, code: string) {
  return createHmac("sha256", getVerificationSecret())
    .update(`${email.toLowerCase()}:${code}`)
    .digest("hex");
}

export function getVerificationCodeExpiration() {
  return new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);
}

export async function sendVerificationCode(input: {
  email: string;
  name: string;
  code: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error(
      "Configure RESEND_API_KEY e RESEND_FROM_EMAIL no arquivo .env",
    );
  }

  const resend = new Resend(apiKey);
  const firstName = input.name.trim().split(/\s+/)[0] || "cliente";
  const safeFirstName = escapeHtml(firstName);
  const { error } = await resend.emails.send({
    from,
    to: input.email,
    subject: `${input.code} é seu código de confirmação`,
    text: `Olá, ${firstName}. Seu código de confirmação da Selavie Femme é ${input.code}. Ele expira em ${CODE_TTL_MINUTES} minutos. Se você não criou esta conta, ignore este e-mail.`,
    html: `
      <div style="background:#eef9fc;padding:40px 16px;font-family:Arial,sans-serif;color:#1a5f7a">
        <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #ade8f4;border-radius:24px;padding:32px;text-align:center">
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#5bbcd6">Selavie Femme</p>
          <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:400">Confirme seu e-mail</h1>
          <p style="margin:0 0 24px;color:#5a8a9a">Olá, ${safeFirstName}. Use o código abaixo para liberar o acesso à sua conta.</p>
          <div style="display:inline-block;border-radius:16px;background:#dff6fb;padding:16px 28px;font-size:32px;font-weight:600;letter-spacing:10px;color:#1a5f7a">${input.code}</div>
          <p style="margin:24px 0 0;font-size:13px;color:#7aabba">Este código expira em ${CODE_TTL_MINUTES} minutos.</p>
        </div>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}
