/**
 * Gera ZIP pré-buildado para Hostinger SEM rodar `next build` no servidor.
 * Contorna o erro EACCES do ambiente de build da Hostinger.
 *
 * Uso: npm run pack:standalone
 */
import { cp, mkdir, rm, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "dist-hostinger");
const stage = path.join(outDir, "standalone-stage");
const zipPath = path.join(outDir, "selavie-femme-standalone.zip");
const standaloneSrc = path.join(root, ".next", "standalone");

console.log("1/3 Build local (webpack + standalone)...");
execFileSync("npm", ["run", "build"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NODE_ENV: "production" },
});

await access(standaloneSrc);

console.log("2/3 Montando pasta de deploy...");
await rm(outDir, { recursive: true, force: true });
await mkdir(stage, { recursive: true });
await cp(standaloneSrc, stage, { recursive: true });
await mkdir(path.join(stage, ".next"), { recursive: true });
await cp(path.join(root, ".next", "static"), path.join(stage, ".next", "static"), {
  recursive: true,
});
await cp(path.join(root, "public"), path.join(stage, "public"), {
  recursive: true,
});

console.log("3/3 Compactando ZIP...");
execFileSync(
  "powershell.exe",
  [
    "-NoProfile",
    "-Command",
    `
    $ErrorActionPreference = 'Stop'
    $stage = '${stage.replace(/'/g, "''")}'
    $zip = '${zipPath.replace(/'/g, "''")}'
    if (Test-Path $zip) { Remove-Item $zip -Force }
    Compress-Archive -Path (Join-Path $stage '*') -DestinationPath $zip -Force
    Remove-Item $stage -Recurse -Force
    Write-Host "ZIP: $zip"
    Write-Host ("Tamanho MB: " + [math]::Round((Get-Item $zip).Length / 1MB, 2))
    `,
  ],
  { stdio: "inherit" },
);

console.log(`
Pronto: ${zipPath}

Na Hostinger (Node.js App), use:
  Install:  true
  Build:    true
  Start:    node server.js
  Node:     22

Cole as variáveis de .env.production.example no hPanel.
NÃO envie o arquivo .env dentro do ZIP.
`);
