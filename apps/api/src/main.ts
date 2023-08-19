import express from "express";
import { env, isDev } from "@embellish/env";
import { db } from "./db";
import { IdSchema, Profile, ProfileSchema } from "src/entity/profile";
import { Session } from "src/entity/session";
import session from "express-session";
import { TypeormStore } from "connect-typeorm";
import passport from "passport";
import "src/auth";

export const app = express();

export async function init() {
  await db.initialize();
  if (isDev()) await db.synchronize();
  else await db.runMigrations();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(session({
    secret: env("EXPRESS_SESSION_SECRET", "5809ddaaff50a8f08849fc1fdf3ffac9337f5fd46fd351fec3f20ab102645df6"),
    resave: false,
    saveUninitialized: false,
    cookie: { secure: !isDev() },
    store: new TypeormStore({
      cleanupLimit: 2,
      limitSubquery: false,
      ttl: 10 * 365 * 24 * 60 * 60
    }).connect(db.getRepository(Session)),
  }))
  app.use(passport.initialize());
  app.use(passport.session());


  app.get("/ping", (req, res) => res.send("pong!"));

  app.get("/auth", passport.authenticate("discord"));
  app.get("/auth/callback", passport.authenticate("discord", {
    failureRedirect: "/login",
  }), (req, res) => {
    res.redirect("/profile");
  });
  app.get("/logout", (req, res) => {
    req.logout(() => {});
    res.redirect("/");
  });

  app.get("/profile/:id?", async (req, res) => {
    const id = req.params.id ?? (req as any).user?.id;
    if (!IdSchema.parse(id)) return res.status(400).json({ error: `Invalid discord id: ${id}` });
    const profile = await Profile.findOneBy({ id });
    return res.json(profile ?? { id });
  });

  app.post("/profile", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    const id = (req as any).user.id;
    if (!IdSchema.parse(id)) return res.status(400).json({ error: `Invalid discord id: ${id}` });
    const body = ProfileSchema.parse(req.body);
    await Profile.upsert({ ...body, id, }, ["id"]);
    return res.json(await Profile.findOneBy({ id }));
  });

  await new Promise<void>(resolve => {
    app.listen(env("EXPRESS_PORT", 3000), resolve);
  });
}

init();
