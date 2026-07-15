import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
      <h1 className="font-display text-5xl text-ink">Termos de Uso</h1>
      <div className="mt-8 space-y-4 text-muted">
        <p>
          Ao utilizar o site Selavie Femme, você concorda com as condições de
          navegação, compra e privacidade. Preços, estoques e promoções podem
          ser alterados sem aviso prévio.
        </p>
        <p>
          Pedidos estão sujeitos à confirmação de pagamento e disponibilidade.
          Em caso de inconsistência, nossa equipe entrará em contato.
        </p>
      </div>
    </div>
  );
}
