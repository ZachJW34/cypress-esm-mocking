import * as esbuild from "esbuild";
import * as fs from "fs/promises";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist");

await fs.rm(DIST, { recursive: true, force: true });
await fs.rm(path.join(ROOT, "tsconfig.tsbuildinfo"), { force: true });

await esbuild.build({
  entryPoints: [
    path.join(ROOT, "src", "index.ts"),
    path.join(ROOT, "src", "node.ts"),
  ],
  platform: "node",
  allowOverwrite: true,
  outdir: path.join(DIST, "src"),
  format: "esm",
});
