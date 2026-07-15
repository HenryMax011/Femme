import type { ShippingOption } from "@/types";

export function calculateShipping(zip: string): ShippingOption[] {
  const digits = zip.replace(/\D/g, "");
  if (digits.length !== 8) return [];

  const region = Number(digits.slice(0, 2));
  const base = region >= 1 && region <= 39 ? 0 : region <= 69 ? 12 : 22;

  return [
    {
      id: "sedex",
      name: "SEDEX",
      price: Number((18.9 + base * 0.4).toFixed(2)),
      days: "2 a 4 dias úteis",
    },
    {
      id: "pac",
      name: "PAC",
      price: Number((12.9 + base * 0.25).toFixed(2)),
      days: "5 a 10 dias úteis",
    },
    {
      id: "selavie-express",
      name: "Selavie Express",
      price: region >= 1 && region <= 39 ? 0 : Number((29.9).toFixed(2)),
      days: "1 a 2 dias úteis",
    },
  ];
}
