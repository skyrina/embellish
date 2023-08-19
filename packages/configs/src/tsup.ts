import { defineConfig, Options } from "tsup";
import { bannerOf, exportsOf, externalDepsOf, PackageExport, PackageJson, unique } from "./package";

type Overrides = Options | ((options: Options) => Promise<Options> | Options);
interface Opts {
  externals?: "all" | "none" | "peers";
  overrides?: Overrides;
}

export function tsupConfig(pkg: PackageJson, opts: Opts = {}) {
  const { overrides, externals = "peer" } = opts;

  const targets = exportsOf(pkg);
  const external = externals !== "none" ? externalDepsOf(pkg, externals === "all") : undefined;
  const defaults = typeof overrides === "object" ? overrides : {};
  const banner = bannerOf(pkg);
  const overrideFn = typeof overrides === "function" ? overrides : (it: Options) => it;

  const [wildcards, regulars] = splitBy(targets, it => it.wildcard);
  const regularConfig = mergedConfig(regulars);
  const wildcardConfigs = wildcards.map(wildcardConfig);

  return defineConfig(opts => {
    return Promise.all(
      [regularConfig, ...wildcardConfigs].map(cfg =>
        overrideFn({
          ...opts,
          ...cfg,
          external,
          sourcemap: !opts.watch,
          minify: !opts.watch,
          banner: { js: banner, css: banner },
          ...defaults,
        }),
      ),
    );
  });
}

function formatsOf(exp: PackageExport): ("cjs" | "esm")[] {
  if (exp.import)
    if (exp.require) return ["cjs", "esm"];
    else return ["esm"];
  else return ["cjs"];
}

function splitBy<T>(objects: T[], predicate: (item: T) => boolean): [T[], T[]] {
  return objects.reduce(
    (split, item) => {
      if (predicate(item)) split[0].push(item);
      else split[1].push(item);
      return split;
    },
    [[], []],
  );
}

function wildcardConfig(wildcard: PackageExport): Options {
  return {
    entry: [wildcard.entrypoint],
    outDir: wildcard.outName.replace("*", ""),
    target: "node18",
    format: formatsOf(wildcard),
    dts: !!wildcard.types,
  };
}

function mergedConfig(targets: PackageExport[]): Options {
  const entry = targets.map(target => [
    target.outName.replace(/^(\.\/)?dist\//, ""),
    target.entrypoint,
  ]);
  return {
    entry: Object.fromEntries(entry),
    outDir: "dist",
    target: "node18",
    format: unique(targets.flatMap(formatsOf)),
    dts: !!targets.find(it => it.types),
  };
}
