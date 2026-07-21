/**
 * Pacote Hostinger PREBUILT:
 * - .next de produção (sem cache/dev/standalone)
 * - sem node_modules (npm ci no Linux)
 * - server.js + package.json com build=prisma generate
 */
import { cp, mkdir, rm, access, writeFile, readFile } from "node:fs/promises";
import { statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "dist-hostinger");
const stage = path.join(outDir, "prebuilt-stage");
const zipPath = path.join(outDir, "selavie-femme-standalone.zip");

console.log("1/3 Build local...");
execFileSync("npm", ["run", "build"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NODE_ENV: "production" },
});

await access(path.join(root, ".next", "BUILD_ID"));
await access(path.join(root, "server.js"));

console.log("2/3 Montando pacote enxuto...");
await rm(outDir, { recursive: true, force: true });
await mkdir(path.join(stage, ".next"), { recursive: true });

// Só o necessário para next start / server.js em produção
const nextKeep = [
  "BUILD_ID",
  "build-manifest.json",
  "package.json",
  "prerender-manifest.json",
  "react-loadable-manifest.json",
  "routes-manifest.json",
  "app-path-routes-manifest.json",
  "export-marker.json",
  "images-manifest.json",
  "required-server-files.json",
  "server",
  "static",
];

for (const name of nextKeep) {
  const src = path.join(root, ".next", name);
  try {
    await access(src);
    await cp(src, path.join(stage, ".next", name), { recursive: true });
  } catch {
    // opcional em algumas versões do Next
  }
}

for (const name of [
  "public",
  "prisma",
  "prisma.config.ts",
  "server.js",
  "package-lock.json",
  "next.config.ts",
  "tsconfig.json",
]) {
  await cp(path.join(root, name), path.join(stage, name), { recursive: true });
}

const pkg = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
pkg.scripts = {
  build: "prisma generate",
  start: "node server.js",
  postinstall: "prisma generate",
};
await writeFile(path.join(stage, "package.json"), JSON.stringify(pkg, null, 2));

console.log("3/3 Compactando com tar...");
await rm(zipPath, { force: true });
execFileSync("tar", ["-a", "-c", "-f", zipPath, "-C", stage, "."], {
  stdio: "inherit",
});
await rm(stage, { recursive: true, force: true });

const mb = (statSync(zipPath).size / (1024 * 1024)).toFixed(2);
console.log(`ZIP: ${zipPath}`);
console.log(`Tamanho MB: ${mb}`);
console.log(`
Hostinger:
  Node:     22
  Install:  npm ci --omit=dev
  Build:    npm run build
  Start:    npm run start
`);
