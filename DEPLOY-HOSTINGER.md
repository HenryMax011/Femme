# Hostinger — Selavie Femme (PREBUILT ZIP)

## Gerar o ZIP
```bash
npm run pack:standalone
```
Arquivo: `dist-hostinger/selavie-femme-standalone.zip`

## Configuração no hPanel (obrigatório)

| Campo | Valor |
|--------|--------|
| Node.js | `22` |
| Install command | `npm ci --omit=dev` |
| Build command | `npm run build` |
| Start command | `npm run start` |

### O que cada comando faz
- **Install** → instala `next` e deps **no Linux** (correto)
- **Build** → só `prisma generate` (NÃO recompila o Next → evita EACCES)
- **Start** → `node server.js` sobe o app usando a pasta `.next` do ZIP

## Variáveis de ambiente
Copie de `.env.production.example` com domínio `https://selaviefemme.com.br`.

Obrigatórias: `AUTH_SECRET`, `NEXTAUTH_URL`, `AUTH_URL`, `NEXT_PUBLIC_SITE_URL`, `DATABASE_URL`, `DIRECT_URL`.
