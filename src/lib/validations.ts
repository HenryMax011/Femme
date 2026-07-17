import { z } from "zod";
import { isValidCpf } from "@/lib/utils";
import { BRAZIL_STATE_UFS } from "@/lib/brazil-states";

const phoneDigitsSchema = z
  .string()
  .regex(/^\d{10,11}$/, "Informe DDD + número (10 ou 11 dígitos)");

const cpfDigitsSchema = z
  .string()
  .regex(/^\d{11}$/, "Informe um CPF válido")
  .refine(isValidCpf, "CPF inválido");

export const contactSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  email: z.email("E-mail inválido"),
  phone: z
    .string()
    .refine(
      (value) => value === "" || /^\d{10,11}$/.test(value),
      "Informe DDD + número (10 ou 11 dígitos)",
    )
    .optional()
    .or(z.literal("")),
  message: z.string().min(10, "Mensagem muito curta"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Informe seu nome"),
    email: z.email("E-mail inválido"),
    phone: phoneDigitsSchema,
    password: z.string().min(6, "Mínimo de 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirme a senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

export const verifyEmailSchema = z.object({
  email: z.email("E-mail inválido"),
  code: z.string().regex(/^\d{6}$/, "Informe o código de 6 dígitos"),
});

export const resendVerificationSchema = z.object({
  email: z.email("E-mail inválido"),
});

export const checkoutCustomerSchema = z.object({
  name: z.string().min(2, "Informe o nome completo"),
  email: z.email("E-mail inválido"),
  cpf: cpfDigitsSchema,
  phone: phoneDigitsSchema,
});

export const checkoutAddressSchema = z.object({
  zip: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => /^\d{8}$/.test(value), "CEP inválido"),
  street: z.string().min(2, "Informe a rua"),
  number: z.string().min(1, "Informe o número"),
  complement: z.string().optional(),
  district: z.string().min(2, "Informe o bairro"),
  city: z.string().min(2, "Informe a cidade"),
  state: z.enum(BRAZIL_STATE_UFS as unknown as [string, ...string[]], {
    message: "Selecione a UF",
  }),
});

export const profilePersonalSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  phone: phoneDigitsSchema,
  cpf: cpfDigitsSchema,
});

export const profileAddressSchema = checkoutAddressSchema.extend({
  label: z.string().min(2, "Informe um apelido (ex.: Casa)").max(40),
  isDefault: z.boolean().optional(),
});

export const profilePaymentSchema = z.object({
  holderName: z.string().min(2, "Informe o nome impresso no cartão"),
  cardNumber: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => /^\d{13,19}$/.test(value), "Número do cartão inválido"),
  expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, "Mês inválido"),
  expiryYear: z.string().regex(/^\d{2}$/, "Ano inválido"),
  cvv: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => /^\d{3,4}$/.test(value), "CVV inválido"),
  isDefault: z.boolean().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type CheckoutCustomerInput = z.infer<typeof checkoutCustomerSchema>;
export type CheckoutAddressInput = z.infer<typeof checkoutAddressSchema>;
export type ProfilePersonalInput = z.infer<typeof profilePersonalSchema>;
export type ProfileAddressInput = z.infer<typeof profileAddressSchema>;
export type ProfilePaymentInput = z.infer<typeof profilePaymentSchema>;
