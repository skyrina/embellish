import definePlugin from "@vencord/types/utils/types";
import { log } from "src/test";

export default definePlugin({
  name: "Embellish",
  description: "Customize your Profile",
  authors: [
    {
      name: "skyrina",
      id: 798918994987188276n
    },
    {
      name: "noramass",
      id: 266592999549566988n
    },
    {
      name: "luminella",
      id: 265171603774636032n
    },
  ],
  start() {
    log("Loaded :3");
  },
  stop() {
    log("Unloaded :<");
  }
})
