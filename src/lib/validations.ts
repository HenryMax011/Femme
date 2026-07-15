import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  email: z.email("E-mail inválido"),
  phone: z.string().min(10, "Telefone inválido").optional().or(z.literal("")),
  message: z.string().min(10, "Mensagem muito curta"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Informe seu nome"),
    email: z.email("E-mail inválido"),
    phone: z.string().min(10, "Telefone inválido"),
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

export const checkoutCustomerSchema = z.object({
  name: z.string().min(2, "Informe o nome completo"),
  email: z.email("E-mail inválido"),
  phone: z.string().min(10, "Telefone inválido"),
});

export const checkoutAddressSchema = z.object({
  zip: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
  street: z.string().min(2, "Informe a rua"),
  number: z.string().min(1, "Informe o número"),
  complement: z.string().optional(),
  district: z.string().min(2, "Informe o bairro"),
  city: z.string().min(2, "Informe a cidade"),
  state: z.string().length(2, "UF inválida"),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CheckoutCustomerInput = z.infer<typeof checkoutCustomerSchema>;
export type CheckoutAddressInput = z.infer<typeof checkoutAddressSchema>;
