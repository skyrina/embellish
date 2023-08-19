import express from "express";
import { env, isDev } from "@embellish/env";
import { db } from "./db";
import { Profile } from "src/entity/profile";

export const app = express();

export async function init() {
  await db.initialize();
  if (isDev()) await db.synchronize();
  else await db.runMigrations();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.get("/ping", (req, res) => res.send("pong!"));

  app.get("/profile/:id", async (req, res) => {
    const id = req.params.id;
    if (!Number.isFinite(id)) return res.status(400).json({ error: `Invalid discord id: ${id}` });
    const profile = await Profile.findOne({ where: { id } });
    return res.json(profile ?? { id });
  });

  await new Promise<void>(resolve => {
    app.listen(env("EXPRESS_PORT", 3000), resolve);
  });
}

init();
