import { Client, Server } from "memjs";

const [host, port] = process.env.MEMCACHED_HOST.split(":");

const server = new Server(host, parseInt(port, 10));

export const memcache = new Client([server], { expires: 1800 });

export default memcache;
