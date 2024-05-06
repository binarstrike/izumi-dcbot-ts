// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
import { z } from "zod";

const envConfigSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  CLIENT_ID: z.string().refine((id) => /^[0-9]+$/.test(id)),
  CLIENT_ACTIVITY_NAME: z.string(),
  CLIENT_ACTIVITY_STATUS: z.enum(["online", "idle", "dnd", "invisible"]),
  BOT_TOKEN: z.string(),
  OPENAI_API_KEY: z.string(),
  TENOR_API_KEY: z.string(),
  DATABASE_URL: z.string().url(),
  MEMCACHED_HOST: z.string().url(),
});

envConfigSchema.parse(process.env);

export type EnvConfig = z.infer<typeof envConfigSchema>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends EnvConfig {}
  }
}
