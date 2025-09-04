#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs";
const run = (c) => { try { return execSync(c, { stdio: "pipe" }).toString().trim(); } catch { return ""; } };

console.log("=== NovaTok Doctor ===");
console.log("Node:", run("node -v"), "npm:", run("npm -v"));
const pkg = JSON.parse(fs.readFileSync("package.json","utf8"));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };
const has = (n)=> !!deps?.[n]; const v = (n)=> deps?.[n] || "—";
console.log("\nDeps:\n next:", v("next"), "\n react:", v("react"), "\n prisma:", v("prisma"), "\n typescript:", v("typescript"));
console.log("\nFiles:");
["tsconfig.json",".eslintrc.json",".prettierrc","tailwind.config.ts","prisma/schema.prisma"].forEach(f=>{
  console.log(" ", f, fs.existsSync(f) ? "✅" : "❌");
});
console.log("\nTips:\n - npm run typecheck\n - npx prisma studio\n - npm run reinstall");
