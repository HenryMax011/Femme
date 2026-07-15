import { NextResponse } from "next/server";
import { applyCoupon } from "@/lib/coupons";

export async function POST(req: Request) {
  const body = await req.json();
  const code = String(body.code || "");
  const subtotal = Number(body.subtotal || 0);
  const result = applyCoupon(code, subtotal);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
