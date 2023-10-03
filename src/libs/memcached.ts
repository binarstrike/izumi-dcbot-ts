import { Client, Server } from "memjs";
import { envConfig } from "../env.config";

const HOSTS = envConfig.MEMCACHED_HOST.map((host) => new Server(host.host, host.port));

export const memcache = new Client(HOSTS, { expires: 1800 });
