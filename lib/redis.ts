import { Redis } from "@upstash/redis";


export function getRedisInstance() {
  try {
    return Redis.fromEnv();
  } catch (e) {
    console.error(e)
    throw new Error(`[Redis] could not create new instance`);
  }
}
