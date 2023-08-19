import { Database } from "sqlite3";

export const db = new Database("profiles.db");

db.serialize(() => {
  // language=SQLite
  db.run(`CREATE TABLE IF NOT EXISTS PROFILES (
    id text unique not null,
    name_color integer,
    text_color integer,
    extended_bio text
  );`);
});

