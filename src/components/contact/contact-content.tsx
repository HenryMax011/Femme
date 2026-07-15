"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import {
  FacebookIcon,
  InstagramIcon,
} from "@/components/ui/social-icons";

const easeOut = [0.22, 1, 0.36, 1] as const;

const contacts = [
  {
    icon: MapPin,
    label: "Endereço",
    lines: ["Av. Paulista, 1000 — Bela Vista", "São Paulo, SP — CEP 01310-100"],
  },
  {
    icon: Mail,
    label: "E-mail",
    lines: ["contato@selaviefemme.com.br"],
  },
  {
    icon: Phone,
    label: "Telefone",
    lines: ["(11) 4000-1234"],
  },
  {
    icon: Clock,
    label: "Atendimento",
    lines: ["Seg a Sex · 9h às 18h", "Sáb · 10h às 14h"],
  },
];

export function ContactContent() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="overflow-hidden">
      <section className="relative isolate">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,#dff6fb_0%,transparent_50%),radial-gradient(ellipse_at_bottom_right,#b8e8f5_0%,transparent_45%)]"
        />

        <div className="mx-auto max-w-7xl px-4 pb-8 pt-28 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="max-w-2xl"
          >
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#2a9bb0]">
              Atendimento
            </p>
            <h1 className="font-display text-4xl font-light text-ink sm:text-5xl md:text-6xl">
              Contato
            </h1>
            <p className="mt-4 max-w-lg text-base font-light leading-relaxed text-[#5a8a9a]">
              Tire dúvidas, peça recomendações ou fale sobre pedidos.
              Respondemos com carinho e atenção.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.08 }}
            className="rounded-[2rem] border border-[#ade8f4]/50 bg-white p-6 shadow-[0_12px_40px_rgba(26,95,122,0.08)] sm:p-8"
          >
            <div className="mb-8">
              <h2 className="font-display text-3xl font-light text-ink">
                Envie sua mensagem
              </h2>
              <p className="mt-2 text-sm font-light text-[#5a8a9a]">
                Preencha o formulário e retornaremos o mais breve possível.
              </p>
            </div>
            <ContactForm />
          </motion.div>

          <div className="space-y-5">
            <motion.aside
              initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.14 }}
              className="rounded-[2rem] border border-[#ade8f4]/50 bg-gradient-to-b from-white to-[#f4fbfd] p-6 shadow-[0_12px_40px_rgba(26,95,122,0.06)] sm:p-7"
            >
              <h2 className="font-display text-2xl font-light text-ink">
                Canais diretos
              </h2>
              <div className="mt-6 space-y-5">
                {contacts.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex gap-3.5">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#e8f7fb] text-[#1a5f7a]">
                        <Icon size={18} strokeWidth={1.6} />
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#2a9bb0]">
                          {item.label}
                        </p>
                        {item.lines.map((line) => (
                          <p
                            key={line}
                            className="text-sm font-light leading-relaxed text-[#3a6f80]"
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 border-t border-[#ade8f4]/60 pt-6">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#2a9bb0]">
                  Redes sociais
                </p>
                <div className="mt-3 flex gap-3">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-[#ade8f4] bg-white text-ink transition-all duration-300 hover:border-[#2a9bb0] hover:bg-[#e8f7fb]"
                    aria-label="Instagram"
                  >
                    <InstagramIcon />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-[#ade8f4] bg-white text-ink transition-all duration-300 hover:border-[#2a9bb0] hover:bg-[#e8f7fb]"
                    aria-label="Facebook"
                  >
                    <FacebookIcon />
                  </a>
                </div>
              </div>
            </motion.aside>

            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.2 }}
              className="overflow-hidden rounded-[2rem] border border-[#ade8f4]/50 shadow-[0_12px_40px_rgba(26,95,122,0.06)]"
            >
              <iframe
                title="Localização Selavie Femme"
                src="https://maps.google.com/maps?q=Av.%20Paulista%201000%20S%C3%A3o%20Paulo&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="h-64 w-full grayscale-[20%] transition-[filter] duration-500 hover:grayscale-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
