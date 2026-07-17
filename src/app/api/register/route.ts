import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations";
import {
  createUser,
  deleteUnverifiedUser,
  setVerificationCode,
} from "@/lib/users-store";
import {
  createVerificationCode,
  getVerificationCodeExpiration,
  hashVerificationCode,
  sendVerificationCode,
} from "@/lib/email-verification";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Dados inválidos" },
        { status: 400 },
      );
    }

    const user = await createUser({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      password: parsed.data.password,
    });

    try {
      const code = createVerificationCode();
      await setVerificationCode(
        user.email,
        hashVerificationCode(user.email, code),
        getVerificationCodeExpiration(),
      );
      await sendVerificationCode({
        email: user.email,
        name: user.name,
        code,
      });

      return NextResponse.json(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          verificationRequired: true,
        },
        { status: 201 },
      );
    } catch (error) {
      await deleteUnverifiedUser(user.email);
      console.error("Erro ao enviar confirmação de cadastro:", error);
      const detail =
        error instanceof Error ? error.message : "Erro ao enviar confirmação";
      const isConfigError = detail.includes("RESEND_");
      const isTestRecipientLimit =
        detail.includes("only send testing emails") ||
        detail.includes("verify a domain");

      return NextResponse.json(
        {
          message: isConfigError
            ? detail
            : isTestRecipientLimit
              ? "No modo teste do Resend, só é possível enviar para o e-mail da sua conta Resend. Use esse e-mail no cadastro ou verifique um domínio em resend.com/domains."
              : "Não foi possível enviar o código de confirmação. Tente novamente.",
        },
        { status: 503 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Erro ao cadastrar usuário",
      },
      { status: 400 },
    );
  }
}
