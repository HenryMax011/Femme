import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
};

export default function PrivacyPage() {
  return (
    <PolicyLayout title="Política de Privacidade">
      <p>
        A Selavie Femme coleta dados pessoais necessários para processamento de
        pedidos, atendimento e comunicação. Não compartilhamos informações com
        terceiros sem base legal ou finalidade operacional (pagamento, frete e
        autenticação).
      </p>
      <p>
        Você pode solicitar acesso, correção ou exclusão dos seus dados pelo
        e-mail contato@selaviefemme.com.br.
      </p>
    </PolicyLayout>
  );
}

function PolicyLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
      <h1 className="font-display text-5xl text-ink">{title}</h1>
      <div className="prose prose-neutral mt-8 max-w-none space-y-4 text-muted">
        {children}
      </div>
    </div>
  );
}
