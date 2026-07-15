export type CouponDef = {
  code: string;
  discountPct?: number;
  discountFlat?: number;
};

export const coupons: CouponDef[] = [
  { code: "SELAVIE10", discountPct: 10 },
  { code: "BEMVINDO15", discountPct: 15 },
  { code: "FRETE20", discountFlat: 20 },
];

export function applyCoupon(code: string, subtotal: number) {
  const coupon = coupons.find(
    (c) => c.code.toUpperCase() === code.trim().toUpperCase(),
  );
  if (!coupon) {
    return { ok: false as const, message: "Cupom inválido." };
  }

  let discount = 0;
  if (coupon.discountPct) {
    discount = (subtotal * coupon.discountPct) / 100;
  } else if (coupon.discountFlat) {
    discount = Math.min(coupon.discountFlat, subtotal);
  }

  return {
    ok: true as const,
    code: coupon.code.toUpperCase(),
    discount: Number(discount.toFixed(2)),
    message: "Cupom aplicado com sucesso!",
  };
}
