/**
 * Servidor de produção para Hostinger.
 * Sobe o Next.js a partir da pasta .next (build já feito).
 */
const { createServer } = require("http");
const { parse } = require("url");
const path = require("path");
const fs = require("fs");

const dir = __dirname;
const port = Number.parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOSTNAME || "0.0.0.0";

const buildIdPath = path.join(dir, ".next", "BUILD_ID");
if (!fs.existsSync(buildIdPath)) {
  console.error("Pasta .next não encontrada. Rode npm run build antes do start.");
  process.exit(1);
}

let next;
try {
  next = require("next");
} catch (error) {
  console.error(
    "Pacote 'next' não encontrado. Rode npm ci --omit=dev no servidor.",
    error,
  );
  process.exit(1);
}

if (!Number.isFinite(port) || port <= 0) {
  console.error("PORT inválida:", process.env.PORT);
  process.exit(1);
}

const app = next({
  dev: false,
  dir,
  hostname,
  port,
});

const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = createServer((req, res) => {
      handle(req, res, parse(req.url, true)).catch((error) => {
        console.error("Request error:", error);
        res.statusCode = 500;
        res.end("Internal Server Error");
      });
    });

    server.listen(port, hostname, () => {
      console.log(`Selavie Femme ready on http://${hostname}:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start Next.js:", error);
    process.exit(1);
  });
