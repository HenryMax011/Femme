import { NextResponse } from "next/server";
import {
  createVerificationCode,
  getVerificationCodeExpiration,
  hashVerificationCode,
  sendVerificationCode,
} from "@/lib/email-verification";
import { findUserByEmail, setVerificationCode } from "@/lib/users-store";
import { resendVerificationSchema } from "@/lib/validations";

const RESEND_INTERVAL_MS = 60_000;
const GENERIC_MESSAGE =
  "Se houver uma conta pendente, um novo código será enviado.";

export async function POST(request: Request) {
  const parsed = resendVerificationSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Informe um e-mail válido." },
      { status: 400 },
    );
  }

  const user = await findUserByEmail(parsed.data.email);
  if (!user || user.emailVerifiedAt) {
    return NextResponse.json({ message: GENERIC_MESSAGE });
  }

  const lastSentAt = user.verificationCodeSentAt
    ? new Date(user.verificationCodeSentAt).getTime()
    : 0;
  const remainingMs = RESEND_INTERVAL_MS - (Date.now() - lastSentAt);
  if (remainingMs > 0) {
    return NextResponse.json(
      {
        message: `Aguarde ${Math.ceil(remainingMs / 1000)} segundos para reenviar.`,
      },
      { status: 429 },
    );
  }

  try {
    const code = createVerificationCode();
    await sendVerificationCode({
      email: user.email,
      name: user.name,
      code,
    });
    await setVerificationCode(
      user.email,
      hashVerificationCode(user.email, code),
      getVerificationCodeExpiration(),
    );
    return NextResponse.json({ message: GENERIC_MESSAGE });
  } catch (error) {
    console.error("Erro ao reenviar código de confirmação:", error);
    return NextResponse.json(
      { message: "Não foi possível reenviar o código. Tente novamente." },
      { status: 503 },
    );
  }
}
