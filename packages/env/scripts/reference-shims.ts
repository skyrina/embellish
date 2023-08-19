import fs from "node:fs/promises";
import { resolve } from "node:path";

async function referenceShims() {
  const project = resolve(__dirname, "..");
  const files = await fs.readdir(resolve(project, "dist"));
  const definitions = files.filter(it => /\.d\.[mc]?ts$/.test(it));
  const reference = `/// <reference path="../src/env-shims.d.ts" />\n`;
  for (const def of definitions) {
    const path = resolve(project, "dist", def);
    const content = await fs.readFile(path, "utf-8");
    await fs.writeFile(path, `${reference}${content}`, "utf-8");
  }
}

referenceShims().then();
