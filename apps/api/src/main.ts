import express from "express";
import { env } from "@embellish/env";
// import { db } from "./db";

export const app = express();

export async function init() {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.get("/ping", (req, res) => res.send("pong!"));

  await new Promise<void>(resolve => {
    app.listen(env("EXPRESS_PORT", 3000), resolve);
  });
}

init();
