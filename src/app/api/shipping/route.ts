import { NextResponse } from "next/server";
import { calculateShipping } from "@/lib/shipping";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const zip = searchParams.get("zip") || "";
  const options = calculateShipping(zip);
  if (!options.length) {
    return NextResponse.json({ message: "CEP inválido" }, { status: 400 });
  }
  return NextResponse.json({ options });
}
