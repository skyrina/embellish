import { DataSource } from "typeorm";
import { isDev } from "@embellish/env";
import { Profile } from "src/entity/profile";
import { Session } from "src/entity/session";

export const db = new DataSource({
  type: "sqlite",
  database: "profiles.db",
  logging: isDev(),
  synchronize: isDev(),
  entities: [Profile, Session],
});

