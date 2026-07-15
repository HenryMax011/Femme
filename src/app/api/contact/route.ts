import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { contactSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
  }

  const dir = path.join(process.cwd(), ".data");
  const file = path.join(dir, "contacts.json");
  await fs.mkdir(dir, { recursive: true });

  let list: unknown[] = [];
  try {
    list = JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    list = [];
  }

  list.push({ ...parsed.data, createdAt: new Date().toISOString() });
  await fs.writeFile(file, JSON.stringify(list, null, 2), "utf8");

  return NextResponse.json({ ok: true });
}
