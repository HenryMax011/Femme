import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  findUserById,
  toPublicProfile,
  updateUserProfile,
} from "@/lib/users-store";
import { profilePersonalSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const user = await findUserById(session.user.id);
  if (!user) {
    return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
  }

  return NextResponse.json(toPublicProfile(user));
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const parsed = profilePersonalSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
  }

  const profile = await updateUserProfile(session.user.id, parsed.data);
  if (!profile) {
    return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
  }

  return NextResponse.json(profile);
}
