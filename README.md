# Selavie Femme

E-commerce premium de beleza e cuidados pessoais, construído com Next.js (App Router), TypeScript, Tailwind CSS, Prisma, NextAuth e pagamento via PIX.

## Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion
- **Formulários:** React Hook Form + Zod
- **Estado:** Zustand (carrinho persistente)
- **Auth:** NextAuth (Credentials)
- **Dados:** Catálogo tipado + Prisma/PostgreSQL (produção)
- **Pagamentos:** Mercado Pago PIX (com modo demonstração)

## Começar

```bash
npm install
cp .env.example .env
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Conta demo

- E-mail: `demo@selavie.com.br`
- Senha: `selavie123`

### Cupons

- `SELAVIE10` — 10% off
- `BEMVINDO15` — 15% off
- `FRETE20` — R$ 20 off

## PIX

Sem `MERCADOPAGO_ACCESS_TOKEN`, o checkout gera QR Code + copia e cola em **modo demonstração** e aprova o pagamento automaticamente após ~15 segundos.

Com token do Mercado Pago, o fluxo usa a API oficial e consulta o status real.

## PostgreSQL (opcional)

O storefront funciona com o catálogo em `src/data`. Para persistência Prisma:

```bash
# configure DATABASE_URL no .env
npm run db:generate
npm run db:push
npm run db:seed
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Ambiente local |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção |
| `npm run db:seed` | Popula PostgreSQL |

## Estrutura

```
src/
  app/           # rotas App Router + API
  components/    # UI, layout, home, produtos, checkout
  data/          # catálogo e categorias
  lib/           # auth, pix, frete, validações
  store/         # carrinho Zustand
prisma/          # schema + seed
```
