import express from "express";
import { env, isDev } from "@embellish/env";
import { db } from "./db";
import { Profile, ProfileSchema } from "src/entity/profile";

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
    const profile = await Profile.findOneBy({ id });
    return res.json(profile ?? { id });
  });

  app.post("/profile/:id", async (req, res) => {
    // TODO: determine id from discord api, secure access
    const id = req.params.id;
    if (!Number.isFinite(id)) return res.status(400).json({ error: `Invalid discord id: ${id}` });
    const body = ProfileSchema.parse(req.body);
    await Profile.upsert({ ...body, id, }, ["id"]);
    return res.json(await Profile.findOneBy({ id }));
  });

  await new Promise<void>(resolve => {
    app.listen(env("EXPRESS_PORT", 3000), resolve);
  });
}

init();
