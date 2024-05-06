require("./env.config.ts");
import { ExtendedClient } from "./structures/Client";

export const client = new ExtendedClient();

client.start();
