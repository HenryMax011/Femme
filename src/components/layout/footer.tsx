import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from "@/components/ui/social-icons";

const policies = [
  { href: "/politicas/privacidade", label: "Política de Privacidade" },
  { href: "/politicas/trocas", label: "Trocas e Devoluções" },
  { href: "/politicas/termos", label: "Termos de Uso" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#ade8f4]/50 bg-white/40 backdrop-blur-sm">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4 lg:col-span-2">
          <p className="font-display text-sm font-light tracking-[0.35em] text-ink">
            SF
          </p>
          <p className="font-display text-2xl font-light text-ink">
            Selavie Femme
          </p>
          <p className="max-w-md text-sm font-light leading-relaxed text-muted">
            Beleza sofisticada com ciência e cuidado. Skincare, perfumes e
            bem-estar para quem busca experiências premium no dia a dia.
          </p>
          <div className="flex gap-3">
            {[
              { Icon: InstagramIcon, href: "https://instagram.com", label: "Instagram" },
              { Icon: FacebookIcon, href: "https://facebook.com", label: "Facebook" },
              { Icon: YoutubeIcon, href: "https://youtube.com", label: "YouTube" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center border border-[#ade8f4] bg-white/50 text-aqua transition-all hover:bg-white/80"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-[10px] font-medium uppercase tracking-[0.25em] text-pastel">
            Políticas
          </h3>
          <ul className="space-y-2">
            {policies.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-light text-muted transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-[10px] font-medium uppercase tracking-[0.25em] text-pastel">
            Formas de pagamento
          </h3>
          <div className="flex flex-wrap gap-2">
            {["PIX", "Visa", "Mastercard", "Elo", "Amex"].map((method) => (
              <span
                key={method}
                className="border border-[#ade8f4]/70 bg-white/50 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-ink"
              >
                {method}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm font-light text-muted">
            Atendimento: seg–sex, 9h às 18h
            <br />
            contato@selaviefemme.com.br
          </p>
        </div>
      </div>
      <div className="border-t border-[#ade8f4]/40 py-5 text-center text-[10px] uppercase tracking-[0.2em] text-pastel">
        © {new Date().getFullYear()} Selavie Femme
      </div>
    </footer>
  );
}
