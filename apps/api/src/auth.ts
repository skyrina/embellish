import passport from "passport";
import { Strategy } from "passport-discord";
import { env } from "@embellish/env";
import { Profile } from "src/entity/profile";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, Profile.create(user));
});

passport.use(new Strategy({
  clientID: env("DISCORD_CLIENT_ID"),
  clientSecret: env("DISCORD_CLIENT_SECRET"),
  callbackURL: env("EXPRESS_AUTH_CALLBACK"),
  scope: ["identify"],
  prompt: 'consent',
}, async (accessToken, refreshToken, profile, done) => {
  await Profile.upsert({ id: profile.id }, ['id']);
  const data = await Profile.findOneBy({ id: profile.id });
  done(null, data);
  return data;
}));
