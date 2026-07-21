# Hostinger — Selavie Femme

## Caminho recomendado: ZIP standalone

Arquivo: `dist-hostinger/selavie-femme-standalone.zip`  
Gerar: `npm run pack:standalone`

| Campo | Valor |
|--------|--------|
| Node.js | `22` |
| Install command | `true` |
| Build command | `npm run build` |
| Start command | `npm run start` |

O ZIP já vem com `.next` compilado. O script `build` só confirma (não recompila).  
O `start` roda o `server.js` gerado pelo Next (standalone).

## Caminho alternativo: Git

| Campo | Valor |
|--------|--------|
| Node.js | `22` |
| Install | `npm ci` |
| Build | `npm run build` |
| Start | `npm run start` |

Se der `EACCES` no build, use o ZIP standalone.

## Variáveis de ambiente (obrigatórias)

```
NEXT_PUBLIC_SITE_URL=https://selaviefemme.com.br
NEXT_PUBLIC_WHATSAPP=5511999999999
AUTH_SECRET=<segredo forte>
NEXTAUTH_URL=https://selaviefemme.com.br
AUTH_URL=https://selaviefemme.com.br
RESEND_API_KEY=...
RESEND_FROM_EMAIL=...
DATABASE_URL=...
DIRECT_URL=...
PIX_KEY=...
PIX_MERCHANT_NAME=SELAVIE FEMME
PIX_MERCHANT_CITY=SAO PAULO
ORDER_NOTIFY_EMAIL=...
```

Modelo: `.env.production.example`
