import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAvalancheAmbassador, attestedAvalancheAmbassador} from "@/lib/avalanche-ambassador"
import { signAvalancheAmbassador} from '@/lib/signing/avalanche-ambassador';

import { getRedisInstance } from "@/lib/redis";
import { Lock } from "@upstash/lock";
import { ATTESTATION_DEADLINE } from "@/lib/config";
import { getWalletAddress } from "@/lib/utils";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session === undefined || session === null) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 400 })
  }

  const walletAddress = getWalletAddress(session)
  if (!walletAddress) {
    return NextResponse.json({ error: 'No wallet address found in session' }, { status: 400 })
  }

  if (!isAvalancheAmbassador(walletAddress)) {
    return NextResponse.json({ error: 'User does not have the yieldyak airdrop' }, { status: 400 })
  }

  if (await attestedAvalancheAmbassador(walletAddress)) {
    return NextResponse.json({ error: 'User has attestation' }, { status: 400 })
  }

  const key = `${walletAddress}-yield-yak-airdrop`;
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
      const signedResponse = await signAvalancheAmbassador(walletAddress);
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
