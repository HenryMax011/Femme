import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "dist-hostinger");
const zipPath = path.join(outDir, "selavie-femme-hostinger.zip");

const exclude = [
  "node_modules",
  ".next",
  ".git",
  ".data",
  ".env",
  ".env.local",
  ".env.production",
  ".vercel",
  "dist-hostinger",
  "coverage",
];

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

if (process.platform === "win32") {
  const stage = path.join(outDir, "stage");
  await mkdir(stage, { recursive: true });

  execFileSync(
    "powershell.exe",
    [
      "-NoProfile",
      "-Command",
      `
      $ErrorActionPreference = 'Stop'
      $root = '${root.replace(/'/g, "''")}'
      $stage = '${stage.replace(/'/g, "''")}'
      $zip = '${zipPath.replace(/'/g, "''")}'
      $excludeNames = @(${exclude.map((e) => `'${e}'`).join(",")})

      Get-ChildItem -Force -LiteralPath $root | ForEach-Object {
        $name = $_.Name
        if ($excludeNames -contains $name) { return }
        if ($name -like '.env*' -and $name -ne '.env.example' -and $name -ne '.env.production.example') { return }
        Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $stage $name) -Recurse -Force
      }

      if (Test-Path $zip) { Remove-Item $zip -Force }
      Compress-Archive -Path (Join-Path $stage '*') -DestinationPath $zip -Force
      Remove-Item $stage -Recurse -Force
      Write-Host "ZIP criado: $zip"
      `,
    ],
    { stdio: "inherit" },
  );
} else {
  execFileSync(
    "zip",
    ["-r", zipPath, ".", ...exclude.flatMap((p) => ["-x", p, "-x", `${p}/*`])],
    { cwd: root, stdio: "inherit" },
  );
}

console.log(`\nPronto: ${zipPath}`);
console.log("NÃO inclua .env no ZIP. Configure as variáveis no hPanel.");
