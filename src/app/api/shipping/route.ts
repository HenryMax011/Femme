import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateShipping } from "@/lib/shipping";

const shippingSchema = z.object({
  zip: z.string().min(8, "CEP inválido"),
});

export async function POST(req: Request) {
  const parsed = shippingSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "CEP inválido" }, { status: 400 });
  }

  const options = calculateShipping(parsed.data.zip);
  if (!options.length) {
    return NextResponse.json({ message: "CEP inválido" }, { status: 400 });
  }
  return NextResponse.json({ options });
}
