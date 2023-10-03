// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
import { z } from "zod";

const envConfigSchema = z.object({
  NODE_ENV: z.enum(["dev", "production"]),
  CLIENT_ID: z.string().refine((id) => !isNaN(parseInt(id)), "client id is not a number"),
  BOT_TOKEN: z.string(),
  MEMCACHED_HOST: z
    .string()
    .transform((host) => {
      return host.split(",").map((hostAndPort) => {
        const [host, port] = hostAndPort.split(":");
        return { host, port: parseInt(port) };
      });
    })
    .default("localhost:11211")
    .refine(
      (v) =>
        v.every(
          ({ host, port }) => typeof host === "string" && typeof port === "number" && !isNaN(port),
        ),
      "memcache hostname or port is invalid, example: localhost:11211",
    ),
  OPENAI_KEY: z.string(),
  TENOR_API_KEY: z.string(),
  DATABASE_URL: z.string(),
});

export const envConfig = envConfigSchema.parse(process.env);

export type EnvConfigType = z.infer<typeof envConfigSchema>;

export default envConfig;
