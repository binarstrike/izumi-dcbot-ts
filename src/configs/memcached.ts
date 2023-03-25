import { MemcacheClient } from "memcache-client"

const MEMCACHED_HOST: string = process.env.MEMCACHED_HOST || "localhost"

export const memcacheClient: MemcacheClient = new MemcacheClient({
  server: `${MEMCACHED_HOST}:11211`,
})

export default memcacheClient
