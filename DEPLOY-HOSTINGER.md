# Deploy Selavie Femme na Hostinger (Node.js Web App)

## Requisitos

- Plano Hostinger com **Node.js Web Apps** (Business / Cloud / Ilimitado com Node.js)
- Node **22** (recomendado; evita warning do Prisma)
- Domínio apontado (ou domínio temporário da Hostinger)
- Variáveis de ambiente preenchidas no hPanel (nunca no ZIP)

## Configuração no hPanel

1. **Websites** → **Add Website** → **Node.js Apps** (ou Deploy Web App)
2. Escolha:
   - **Import Git Repository** (recomendado): `https://github.com/HenryMax011/Femme.git` → branch `main`
   - **ou Upload ZIP**: use `dist-hostinger/selavie-femme-hostinger.zip`
3. Build settings:

| Campo | Valor |
|--------|--------|
| Node.js | `22` |
| Install | `npm ci` |
| Build | `npm run build` |
| Start | `npm run start -- -p $PORT` |

> O `npm run build` usa **Webpack** (não Turbopack). Turbopack no build falha com `EACCES` na Hostinger.

4. Em **Environment variables**, copie de `.env.production.example` e ajuste:
   - `NEXT_PUBLIC_SITE_URL` e `NEXTAUTH_URL` / `AUTH_URL` = `https://seu-dominio`
   - `AUTH_SECRET` = segredo novo
   - `DATABASE_URL` / `DIRECT_URL`
   - `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
   - `PIX_KEY`, `ORDER_NOTIFY_EMAIL`
5. Clique em **Deploy** / **Redeploy**

## Se der EACCES / permission denied

1. Confirme que o Build é `npm run build` (Webpack).
2. Troque Node para **22**.
3. Em Deployments → **Settings and redeploy** (redeploy limpo).
4. Prefira deploy via **GitHub** em vez de ZIP do Windows.
5. Se o site antigo em `public_html` era PHP, remova o site e crie um **Node.js App** novo no domínio.

## Gerar o ZIP localmente

```bash
npm run pack:hostinger
```

Arquivo gerado: `dist-hostinger/selavie-femme-hostinger.zip`  
(não inclui `node_modules`, `.next`, `.env`, `.data`, `.git`)

## Checklist pós-deploy

- [ ] Site abre em HTTPS
- [ ] Login / cadastro / verificação de e-mail
- [ ] Listagem de produtos
- [ ] Checkout PIX
- [ ] Perfil (endereços / cartões)
- [ ] DNS do domínio de e-mail no Resend (DKIM/SPF)

## Atenção: dados em `.data/`

Usuários e pedidos ainda são salvos em arquivos JSON em `.data/` no disco do app.  
Em redeploy esses arquivos **podem ser apagados**. Para produção estável, migre auth/pedidos para PostgreSQL (Prisma).

## Referência oficial

https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
