export function detectCardBrand(cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, "");
  if (/^4/.test(digits)) return "Visa";
  if (/^5[1-5]/.test(digits) || /^2(2[2-9]|[3-6]|7[01]|720)/.test(digits)) {
    return "Mastercard";
  }
  if (/^3[47]/.test(digits)) return "Amex";
  if (/^(636368|438935|504175|451416|636297|5067|4576|4011|506699)/.test(digits)) {
    return "Elo";
  }
  if (/^606282|^3841/.test(digits)) return "Hipercard";
  return "Cartão";
}

export function formatCardNumberDisplay(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}
