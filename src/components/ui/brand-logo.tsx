import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Altura visual da logo */
  size?: "sm" | "md" | "lg";
  priority?: boolean;
  /**
   * ink = teal legível em fundo claro (header/footer)
   * glass = versão clara (fundos escuros)
   */
  variant?: "ink" | "glass";
};

const sizes = {
  sm: { className: "h-12 w-auto sm:h-[3.25rem]", width: 160, height: 160 },
  md: { className: "h-16 w-auto", width: 200, height: 200 },
  lg: { className: "h-20 w-auto", width: 240, height: 240 },
};

const sources = {
  ink: "/images/logo-selavie-ink.png?v=1",
  glass: "/images/logo-selavie.png?v=2",
};

export function BrandLogo({
  className,
  size = "md",
  priority,
  variant = "ink",
}: Props) {
  const s = sizes[size];
  return (
    <Image
      src={sources[variant]}
      alt="Selavie Femme"
      width={s.width}
      height={s.height}
      priority={priority}
      unoptimized
      className={cn(
        "object-contain object-left drop-shadow-[0_2px_10px_rgba(26,95,122,0.18)]",
        s.className,
        className,
      )}
    />
  );
}
