import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { detectCardBrand } from "@/lib/cards";
import {
  addUserPaymentMethod,
  removeUserPaymentMethod,
  setDefaultUserPaymentMethod,
} from "@/lib/users-store";
import { profilePaymentSchema } from "@/lib/validations";
import { z } from "zod";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const parsed = profilePaymentSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "Cartão inválido" }, { status: 400 });
  }

  const cardNumber = parsed.data.cardNumber;
  const profile = await addUserPaymentMethod(session.user.id, {
    brand: detectCardBrand(cardNumber),
    last4: cardNumber.slice(-4),
    holderName: parsed.data.holderName.trim(),
    expiryMonth: parsed.data.expiryMonth,
    expiryYear: parsed.data.expiryYear,
    isDefault: parsed.data.isDefault,
  });
  // CVV é validado no schema, mas nunca persistido.

  if (!profile) {
    return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
  }

  return NextResponse.json(profile, { status: 201 });
}

const paymentActionSchema = z.object({
  methodId: z.string().min(1),
  action: z.enum(["delete", "default"]),
});

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const parsed = paymentActionSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
  }

  const profile =
    parsed.data.action === "delete"
      ? await removeUserPaymentMethod(session.user.id, parsed.data.methodId)
      : await setDefaultUserPaymentMethod(session.user.id, parsed.data.methodId);

  if (!profile) {
    return NextResponse.json(
      { message: "Forma de pagamento não encontrada" },
      { status: 404 },
    );
  }

  return NextResponse.json(profile);
}
