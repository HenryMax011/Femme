import type { Metadata } from "next";
import { ContactContent } from "@/components/contact/contact-content";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Selavie Femme. Estamos prontos para ajudar.",
};

export default function ContactPage() {
  return <ContactContent />;
}
