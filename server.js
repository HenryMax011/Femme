/**
 * Entry point de produção para Hostinger / Node.js hosting.
 * Usa o build em .next (npm run build) e escuta PORT + 0.0.0.0.
 */
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const port = Number(process.env.PORT) || 3000;
const hostname = process.env.HOSTNAME || "0.0.0.0";

const app = next({
  dev: false,
  hostname,
  port,
});

const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(port, hostname, () => {
      console.log(`Selavie Femme ready on http://${hostname}:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start Next.js server:", error);
    process.exit(1);
  });
