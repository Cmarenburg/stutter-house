import type { Config } from "drizzle-kit";
 
export default {
  schema: "./app/drizzle/schema.server.ts",
  out: "./drizzle",
  driver: "libsql",
  introspect: {
    casing: "camel",
  },
  dbCredentials: {
    url: "ws://127.0.0.1:8080"
  }
} satisfies Config;