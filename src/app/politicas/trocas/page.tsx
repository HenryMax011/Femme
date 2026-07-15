import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trocas e Devoluções",
};

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
      <h1 className="font-display text-5xl text-ink">Trocas e Devoluções</h1>
      <div className="mt-8 space-y-4 text-muted">
        <p>
          Você tem até 7 dias corridos após o recebimento para solicitar
          devolução por arrependimento, conforme o Código de Defesa do
          Consumidor.
        </p>
        <p>
          Produtos com lacre violado, parcialmente utilizados ou sem embalagem
          original podem não ser elegíveis, salvo defeito de fabricação.
        </p>
        <p>
          Para iniciar uma solicitação, entre em contato pelo WhatsApp ou e-mail
          contato@selaviefemme.com.br com o número do pedido.
        </p>
      </div>
    </div>
  );
}
