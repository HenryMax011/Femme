import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  addUserAddress,
  removeUserAddress,
  setDefaultUserAddress,
} from "@/lib/users-store";
import { profileAddressSchema } from "@/lib/validations";
import { z } from "zod";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const parsed = profileAddressSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "Endereço inválido" }, { status: 400 });
  }

  const profile = await addUserAddress(session.user.id, {
    label: parsed.data.label,
    zip: parsed.data.zip,
    street: parsed.data.street,
    number: parsed.data.number,
    complement: parsed.data.complement,
    district: parsed.data.district,
    city: parsed.data.city,
    state: parsed.data.state,
    isDefault: parsed.data.isDefault,
  });

  if (!profile) {
    return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
  }

  return NextResponse.json(profile, { status: 201 });
}

const addressActionSchema = z.object({
  addressId: z.string().min(1),
  action: z.enum(["delete", "default"]),
});

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const parsed = addressActionSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
  }

  const profile =
    parsed.data.action === "delete"
      ? await removeUserAddress(session.user.id, parsed.data.addressId)
      : await setDefaultUserAddress(session.user.id, parsed.data.addressId);

  if (!profile) {
    return NextResponse.json({ message: "Endereço não encontrado" }, { status: 404 });
  }

  return NextResponse.json(profile);
}
