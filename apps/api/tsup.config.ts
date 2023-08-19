import pkg from "./package.json";
import { tsupConfig } from "@embellish/configs/tsup";

export default tsupConfig(pkg, { externals: "all" });
