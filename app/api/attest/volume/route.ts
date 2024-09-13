import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { signVolume } from '@/lib/signing/volume';

import { getRedisInstance } from "@/lib/redis";
import { Lock } from "@upstash/lock";
import { ATTESTATION_DEADLINE, PRIVATE_KEY, JSON_RPC_ENDPOINT } from "@/lib/config";
import { getWalletAddress } from "@/lib/utils";

import { Wallet, JsonRpcProvider } from 'ethers';
import { getTotalVolume, getAttestedVolume } from "@/lib/volume";
import { getProxy } from "@/lib/proxy";

export const runtime = "edge";


export async function GET(req: NextRequest) {
  const session = await auth();
  if (session === undefined || session === null) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 400 })
  }

  const walletAddress = getWalletAddress(session)
  if (!walletAddress) {
    return NextResponse.json({ error: 'No wallet address found in session' }, { status: 400 })
  }

  const totalVolume = await getTotalVolume(walletAddress);
  return NextResponse.json({ volume: totalVolume });
}


export async function POST(req: NextRequest) {
  const session = await auth();
  if (session === undefined || session === null) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 400 })
  }

  const walletAddress = getWalletAddress(session)
  if (!walletAddress) {
    return NextResponse.json({ error: 'No wallet address found in session' }, { status: 400 })
  }

  const provider = new JsonRpcProvider(JSON_RPC_ENDPOINT);
  const signer = new Wallet(
    PRIVATE_KEY,
    provider
  );

  const totalVolume = await getTotalVolume(walletAddress);
  if (totalVolume === undefined) {
    return NextResponse.json({ error: 'Unable to fetch volume' }, { status: 503})
  }
  const attestedVolume = await getAttestedVolume(walletAddress, signer, getProxy(provider));
  const volumeToAttest = totalVolume - attestedVolume;

  if (!volumeToAttest) {
    return NextResponse.json({ error: 'User has no attestable volume' }, { status: 400 })
  }

  const key = `${walletAddress}-volume`;
  const redis = getRedisInstance();
  const lock = new Lock({
    id: `${key}-lock`,
    lease: 5000,
    redis: redis,
  })

  if (await lock.acquire()) {
    try {
      const current = await redis.get(key);
      if (current) {
        return NextResponse.json(current);
      }
      const signedResponse = await signVolume(walletAddress, volumeToAttest);
      await redis.set(key, {signedResponse}, {ex: ATTESTATION_DEADLINE});
      return NextResponse.json({ signedResponse })
    }
    finally {
      await lock.release()
    }
  } else {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429})
  }

}
