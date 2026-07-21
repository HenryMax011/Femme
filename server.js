/**
 * Servidor de produção para Hostinger / Node.js hosting.
 * Usa o build em ./.next e escuta process.env.PORT em 0.0.0.0.
 */
const { createServer } = require("http");
const { parse } = require("url");
const path = require("path");
const next = require("next");

const dir = path.join(__dirname);
const port = Number.parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOSTNAME || "0.0.0.0";

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
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl).catch((error) => {
        console.error("Request error:", error);
        res.statusCode = 500;
        res.end("Internal Server Error");
      });
    });

    server.listen(port, hostname, () => {
      console.log(`Selavie Femme listening on http://${hostname}:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start Next.js:", error);
    process.exit(1);
  });
