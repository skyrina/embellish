import fs from "node:fs/promises";
import { resolve } from "node:path";

const shimContent = (vars: string[]) => `declare namespace NodeJS {
  export interface EnvFile {
${vars.map(it => `    ${it}: string;`).join("\n")}
  }

  export interface ProcessEnv extends EnvFile {}
}
`;

export async function envFileVars(path: string) {
  try {
    const content = await fs.readFile(path, "utf-8");
    return content
      .split(/\n/g)
      .map(it => it.split("=")[0].trim())
      .filter(it => /^[A-Za-z_][A-Za-z0-9_]+$/.test(it))
      .concat("NODE_ENV");
  } catch {
    return ["NODE_ENV"];
  }
}

function dedupe(vars: string[]): string[] {
  return [...new Set(vars)];
}

export async function generateEnvShims() {
  const project = resolve(__dirname, "..");
  const root = resolve(project, "../..");
  const cwd = resolve(process.cwd());
  const envFiles = await Promise.all(
    [project, root, cwd]
      .flatMap(path => [`${path}/.env.local`, `${path}/.env`])
      .map(file => envFileVars(file))
  );

  const vars = dedupe(envFiles.flat()).sort();
  await fs.writeFile(resolve(project, "src/env-shims.d.ts"), shimContent(vars));
}

generateEnvShims().then();
