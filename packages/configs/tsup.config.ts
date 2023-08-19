import pkg from "./package.json";
import { tsupConfig } from "./src/tsup";

export default tsupConfig(pkg, { externals: "all" });
