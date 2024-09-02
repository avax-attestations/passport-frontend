import { SHORT_URL_TTL } from '@/lib/config';
import { getRedisInstance } from "@/lib/redis";
import { nanoid } from 'nanoid';


export async function getLink(key: string): Promise<string|null> {
  const redis = getRedisInstance();
  return await redis.get(key);
}


export async function shorten(url: string, ttl: number = SHORT_URL_TTL) {
  const redis = getRedisInstance();
  const origin = new URL(url).origin;
  const key = nanoid();
  await redis.set(key, url, {ex: ttl});
  return `${origin}/s/${key}`;
}


export async function fetchShortLink(url: string) {
  const shortenerURL = '/api/shortener';
  try {
    const response = await fetch(shortenerURL, {
      method: 'POST',
      body: JSON.stringify({url: url})
    })
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    return json.url;
  } catch (error: any) {
    console.error(error.message);
  }
}
