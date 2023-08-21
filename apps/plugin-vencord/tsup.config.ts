import pkg from "./package.json";
import { tsupConfig } from "@embellish/configs/tsup";
import { Options } from "tsup";
import { env, isDev } from "@embellish/env";
import { globalExternalsWithRegExp } from "@fal-works/esbuild-plugin-global-externals";
import fs from "node:fs/promises";
import { join } from "node:path";
import * as os from "os";

export default tsupConfig(pkg, {
  externals: "all",
  overrides: options => {
    return Object.assign(options, {
      format: ["esm"],
      // globalName: "VencordPlugin",
      jsxFactory: "Vencord.Webpack.Common.React.createElement",
      jsxFragment: "Vencord.Webpack.Common.React.Fragment",
      external: [],
      target: "esnext",
      plugins: [
        {
          name: "replace-vencord-imports",
          esbuildOptions: options => {
            options.plugins.find(it => it.name === 'external')!.setup = build => {
              build.onResolve({ filter: /^@vencord\/types.+/ }, (args) => {
                return { path: args.path.replace("@vencord/types/", "@"), external: true };
              })
            };
            return options;
          }
        }
      ],
      footer: { js: `//# sourceURL=${encodeURI("embellish/main.ts")}` },
      minify: !isDev(),
      sourcemap: isDev(),
      bundle: true,
      outExtension: () => ({ js: ".js", dts: "" }),
      onSuccess: async () => {
        const pluginDir = join(vencordDir(), "src/userplugins/embellish");
        await fs.rm(pluginDir, { recursive: true, force: true });
        await fs.cp("dist", pluginDir, { recursive: true });
        console.log(`Deployed to ${pluginDir}`);
      },
    } as Options);
  }
});

function vencordDir() {
  if (env("VENCORD_DATA_DIR")) return env("VENCORD_DATA_DIR");
  switch (os.type()) {
    case "Windows_NT": return join(process.env.APPDATA, "Vencord");
    case "Darwin": throw new Error("Please configure VENCORD_DATA_DIR");
    case "Linux": throw new Error("Please configure VENCORD_DATA_DIR");
    default: throw new Error("Please configure VENCORD_DATA_DIR");
  }
}
