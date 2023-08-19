import { config } from "dotenv";

export type EnvKey = keyof NodeJS.ProcessEnv & string;
const truish = "true,1,yes,allow,allowed".split(",");

let configured = false;
export function env<T = string>(
  key: EnvKey,
  defaultValue?: T | (() => T),
): T {
  if (!configured) {
    config({ path: ".env.local"})
    config({ path: ".env"})
    config({ path: "../../.env.local" });
    config({ path: "../../.env" });
    configured = true;
  }
  const type = typeof defaultValue;
  if (type === "function") return env(key, (defaultValue as () => T)());
  const value = process.env[key];
  switch (type) {
    case "string":
      return (value as T) ?? (defaultValue as T);
    case "object":
      return value ? JSON.parse(value) : (defaultValue as T);
    case "number":
      return isNaN(+value) ? (defaultValue as T) : (+value as T);
    case "boolean":
      return value != null ? truish.includes(value.toLowerCase()) as T : (defaultValue as T);
    case "symbol":
      return value != null ? (Symbol.for(value) as T) : (defaultValue as T);
    case "bigint":
      return value != null ? (BigInt(value) as T) : (defaultValue as T);
    case "undefined":
      return value as T;
  }
}

export function isDev() {
  return env<string>("NODE_ENV", "development") !== "production";
}
