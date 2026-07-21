/**
 * ZIP standalone para Hostinger (app já compilado).
 * - Usa o server.js gerado pelo Next (não o custom da raiz)
 * - Remove .env / .data
 * - Corrige caminhos absolutos do Windows
 * - package.json com build + start (exigência Hostinger)
 */
import {
  cp,
  mkdir,
  rm,
  access,
  readFile,
  writeFile,
  readdir,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "dist-hostinger");
const stage = path.join(outDir, "standalone-stage");
const zipPath = path.join(outDir, "selavie-femme-standalone.zip");
const standaloneSrc = path.join(root, ".next", "standalone");

console.log("1/4 Build local (webpack + standalone)...");
execFileSync("npm", ["run", "build"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NODE_ENV: "production" },
});

await access(standaloneSrc);

console.log("2/4 Montando pasta de deploy...");
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

// Remover arquivos sensíveis / locais que o tracing possa ter incluído
for (const name of [".env", ".env.local", ".env.production", ".data", ".git"]) {
  await rm(path.join(stage, name), { recursive: true, force: true });
}

console.log("3/4 Ajustando server.js e package.json...");
const serverJsPath = path.join(stage, "server.js");
let serverJs = await readFile(serverJsPath, "utf8");

// Garante que é o server do Next standalone (tem startServer)
if (!serverJs.includes("startServer") && !serverJs.includes("next/dist/server")) {
  throw new Error(
    "server.js do standalone inválido — rebuild necessário (não use o server.js custom da raiz).",
  );
}

const absVariants = [
  root,
  root.replace(/\\/g, "\\\\"),
  root.replace(/\\/g, "/"),
  JSON.stringify(root).slice(1, -1),
];
for (const variant of [...new Set(absVariants)].filter(Boolean)) {
  serverJs = serverJs.split(variant).join(".");
}
// Força hostname/porta corretos no Linux
if (!serverJs.includes("process.env.PORT")) {
  throw new Error("server.js standalone sem PORT — versão inesperada do Next.");
}
await writeFile(serverJsPath, serverJs, "utf8");

await writeFile(
  path.join(stage, "package.json"),
  JSON.stringify(
    {
      name: "selavie-femme",
      version: "1.0.0",
      private: true,
      scripts: {
        build: "node -e \"console.log('[hostinger] prebuilt standalone — skip compile')\"",
        start: "node server.js",
      },
      engines: { node: ">=20 <25" },
    },
    null,
    2,
  ),
  "utf8",
);

// Sanity: arquivos essenciais
for (const rel of ["server.js", "package.json", ".next", "public", "node_modules"]) {
  await access(path.join(stage, rel));
}

const top = await readdir(stage);
console.log("Conteúdo do pacote:", top.join(", "));

console.log("4/4 Compactando ZIP...");
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

Hostinger (ZIP standalone):
  Node:     22
  Install:  true
  Build:    npm run build
  Start:    npm run start
`);
