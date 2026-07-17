import { NextResponse } from "next/server";
import { hashVerificationCode } from "@/lib/email-verification";
import { verifyEmailCode } from "@/lib/users-store";
import { verifyEmailSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const parsed = verifyEmailSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Informe um e-mail e um código válidos." },
      { status: 400 },
    );
  }

  const result = await verifyEmailCode(
    parsed.data.email,
    hashVerificationCode(parsed.data.email, parsed.data.code),
  );

  if (result === "verified" || result === "already_verified") {
    return NextResponse.json({ verified: true });
  }

  if (result === "expired") {
    return NextResponse.json(
      { message: "O código expirou. Solicite um novo código." },
      { status: 410 },
    );
  }

  if (result === "too_many_attempts") {
    return NextResponse.json(
      { message: "Muitas tentativas. Solicite um novo código." },
      { status: 429 },
    );
  }

  return NextResponse.json(
    { message: "Código incorreto. Confira e tente novamente." },
    { status: 400 },
  );
}
