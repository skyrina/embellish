export interface PackageJsonExportDef {
  node: string;
  import?: string;
  require?: string;
  types?: string;
  entrypoint?: string;
}

export type PackageJsonExport = PackageJsonExportDef | string;

export interface PackageJsonExportFields {
  main?: string;
  module?: string;
  types?: string;
  exports?: PackageJsonExport | PackageJsonExport[] | Record<string, Omit<PackageJsonExport, "node">>;
  entrypoint?: string;
}

export interface PackageJsonDependencies {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

export interface PackageJsonMetadata {
  name: string;
  description: string;
  version: string;
  author: string;
  license: string;
  since?: number;
  url?: string;
  type?: string;
}

export interface PackageJson
  extends PackageJsonMetadata,
    PackageJsonDependencies,
    PackageJsonExportFields {}

export interface PackageExport {
  node?: string;
  import?: string;
  require?: string;
  types?: string;
  entrypoint: string;
  outName: string;
  wildcard: boolean;
}

export function exportsOf(pkg: PackageJson): PackageExport[] {
  function stringToExportDef(str: PackageJsonExport, path = "./"): PackageJsonExportDef {
    if (typeof str === "string")
      return {
        [pkg.type === "module" ? "import" : "require"]: str,
        entrypoint: str.replace(/^(\.\/)?dist/, "./src"),
        types: str.replace(/\.[mc]?`jsx?$/, ".d.ts"),
        node: path,
      };
    return str.node ? str : { ...str, node: path };
  }

  return ((): PackageJsonExportDef[] => {
    if (pkg.main)
      return [
        {
          node: "./",
          require: pkg.main,
          import: pkg.module,
          types: pkg.types,
          entrypoint: pkg.entrypoint,
        },
      ];
    if (Array.isArray(pkg.exports)) return pkg.exports.map(exp => stringToExportDef(exp)) as any;
    if (typeof pkg.exports === "string") return [stringToExportDef(pkg.exports)];
    if (typeof pkg.exports === "object")
      return Object.entries(pkg.exports).map(([path, value]) => stringToExportDef(value, path));
    return [];
  })().map(def => {
    const entrypoint = (() => {
      if (def.entrypoint) return def.entrypoint;
      if (def.types) return def.types.replace("dist", "src").replace(/\.d\.ts$/, ".ts");
      if (def.require)
        return def.require.replace("dist", "src").replace(/\.(c?js|cjs\.js)$/, ".ts");
      if (def.import) return def.import.replace("dist", "src").replace(/\.(m?js|esm\.js)$/, ".ts");
      if (def.node === "./") return "src/index.ts";
    })();
    if (!entrypoint)
      throw new RangeError(
        `Could not determine entry point for configuration: \n\n${JSON.stringify(def, null, 2)}`,
      );
    const outName = (() => {
      if (def.types) return def.types.replace(/\.d\.ts$/, "");
      if (def.require) return def.require.replace(/\.(c?js|cjs\.js)$/, "");
      if (def.import) return def.import.replace(/\.(m?js|esm\.js)$/, "");
      if (def.node === "./") return "dist/index";
    })();
    if (!outName)
      throw new RangeError(
        `Could not determine output name for configuration: \n\n${JSON.stringify(def, null, 2)}`,
      );

    return {
      entrypoint,
      outName,
      node: def.node,
      types: def.types,
      require: def.require,
      import: def.import,
      wildcard: def.node.includes("*"),
    };
  });
}

export function externalDepsOf(pkg: PackageJsonDependencies, allDeps = false): string[] {
  return unique([
    ...Object.keys(allDeps ? pkg.dependencies ?? {} : {}),
    ...Object.keys(pkg.optionalDependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ]);
}

export function bannerOf(pkg: PackageJsonMetadata): string {
  const start = pkg.since ?? new Date().getFullYear();
  const end = new Date().getFullYear();
  const range = start === end ? `${start}` : `${start} - ${end}`;

  const content = [
    `@module ${pkg.name}`,
    pkg.version !== "0.0.0" && `@version ${pkg.version}`,
    pkg.description && `@file ${pkg.description}`,
    pkg.author && `@copyright © ${range} ${pkg.author}`,
    pkg.license && `@license ${pkg.license}`,
    pkg.url,
  ]
    .filter(Boolean)
    .map(String)
    .map(it => it.trim())
    .filter(Boolean)
    .join("\n")
    .split("\n")
    .map(line => ` * ${line}`)
    .join("\n");

  return `/**\n${content}\n */`;
}

export function unique<T>(elements: T[]): T[] {
  return [...new Set(elements)];
}
