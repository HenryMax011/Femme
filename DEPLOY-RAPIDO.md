# Subir o site AGORA (contornar EACCES da Hostinger)

O build na Hostinger quebra por permissão no servidor deles.
Use um destes caminhos — o mais rápido primeiro.

---

## Opção A — Vercel (recomendado, ~10 min)

Next.js funciona melhor na Vercel. A Hostinger fica só no domínio (DNS).

1. Faça **commit + push** do projeto para o GitHub (`HenryMax011/Femme`).
2. Acesse https://vercel.com → Login com GitHub → **Add New Project** → importe `Femme`.
3. Framework: Next.js (auto).
4. Em **Environment Variables**, cole as do `.env.production.example` (com URLs `https://seu-dominio` ou a URL `.vercel.app` temporária).
5. Deploy.
6. Depois, no DNS da Hostinger (domínio `selaviefemme.com.br`):
   - Apontar para a Vercel (eles mostram os records A/CNAME no painel do projeto).

Pronto: site no ar sem depender do build da Hostinger.

---

## Opção B — Hostinger sem build (standalone)

Gera o site **no seu PC** e sobe só o resultado. A Hostinger só executa `node server.js`.

### No seu PC

```bash
npm run pack:standalone
```

Arquivo: `dist-hostinger/selavie-femme-standalone.zip`

### No hPanel (Node.js App)

| Campo | Valor |
|--------|--------|
| Node.js | `22` |
| Install command | `true` |
| Build command | `true` |
| Start command | `node server.js` |

1. Upload do ZIP **standalone** (não o ZIP de código-fonte).
2. Cole as variáveis de ambiente.
3. Deploy / Redeploy.

Se a Hostinger forçar `npm ci` e falhar, peça no suporte para permitir install/build vazios, ou use a **Opção A**.

---

## Variáveis mínimas

- `AUTH_SECRET`
- `NEXTAUTH_URL` / `AUTH_URL` / `NEXT_PUBLIC_SITE_URL` = URL pública HTTPS
- `DATABASE_URL` + `DIRECT_URL`
- `RESEND_API_KEY` + `RESEND_FROM_EMAIL`
- `PIX_KEY` + `ORDER_NOTIFY_EMAIL`

---

## Atenção

Usuários/pedidos em `.data/` somem em redeploy. Em produção estável, migrar para PostgreSQL.
