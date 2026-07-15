import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Selavie Femme | Beleza e Cuidados Pessoais",
    template: "%s | Selavie Femme",
  },
  description:
    "Skincare, perfumes e cuidados pessoais premium para homens e mulheres. Descubra a Selavie Femme.",
  keywords: [
    "skincare",
    "perfumes",
    "cosméticos",
    "beleza",
    "Selavie Femme",
    "cuidados pessoais",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Selavie Femme",
    title: "Selavie Femme | Beleza e Cuidados Pessoais",
    description:
      "Sua beleza merece o melhor cuidado. Skincare, perfumes e bem-estar premium.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Selavie Femme",
    description: "Beleza sofisticada com ciência e cuidado.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex min-h-full flex-col antialiased">
        <AuthSessionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
