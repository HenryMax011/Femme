import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations";
import { createUser } from "@/lib/users-store";

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

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
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
