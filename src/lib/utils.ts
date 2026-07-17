import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatInstallments(price: number, times = 6) {
  const installment = price / times;
  return `${times}x de ${formatCurrency(installment)} sem juros`;
}

export function generateOrderNumber() {
  const now = Date.now().toString().slice(-8);
  const rand = Math.floor(Math.random() * 900 + 100);
  return `SF-${now}${rand}`;
}

/** Mantém só dígitos e limita a 11 (DDD + celular BR). */
export function sanitizePhoneDigits(value: string, max = 11) {
  return value.replace(/\D/g, "").slice(0, max);
}

export function sanitizeCpfDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}

export function formatCpfDisplay(digits: string) {
  const value = sanitizeCpfDigits(digits);
  if (!value) return "";
  if (value.length <= 3) return value;
  if (value.length <= 6) return `${value.slice(0, 3)}.${value.slice(3)}`;
  if (value.length <= 9) {
    return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
  }
  return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
}

/** Validação oficial dos dígitos verificadores do CPF. */
export function isValidCpf(value: string) {
  const cpf = sanitizeCpfDigits(value);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  const calc = (base: string, factor: number) => {
    let total = 0;
    for (let i = 0; i < base.length; i += 1) {
      total += Number(base[i]) * (factor - i);
    }
    const rest = (total * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const d1 = calc(cpf.slice(0, 9), 10);
  const d2 = calc(cpf.slice(0, 10), 11);
  return d1 === Number(cpf[9]) && d2 === Number(cpf[10]);
}

export function sanitizeCepDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 8);
}

export function formatCepDisplay(digits: string) {
  const value = sanitizeCepDigits(digits);
  if (!value) return "";
  if (value.length <= 5) return value;
  return `${value.slice(0, 5)}-${value.slice(5)}`;
}
