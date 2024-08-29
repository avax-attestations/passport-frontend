import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isReferred, referralCodeRedeemed, verifyReferralCode } from "@/lib/referral";
import { signReferral } from '@/lib/signing/referral';
import { getRedisInstance } from "@/lib/redis";
import { Lock } from "@upstash/lock";
import { ATTESTATION_DEADLINE, JSON_RPC_ENDPOINT, REFERRAL_CODE_LIMIT, REFERRAL_MESSAGE_PREFIX } from "@/lib/config";
import { getWalletAddress } from "@/lib/utils";
import { createPublicClient, http } from 'viem';

export const runtime = "edge";


const codePattern = new RegExp(`^${REFERRAL_MESSAGE_PREFIX}(\\d+)$`);

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session === undefined || session === null) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 400 })
  }

  const walletAddress = getWalletAddress(session)
  if (!walletAddress) {
    return NextResponse.json({ error: 'No wallet address found in session' }, { status: 400 })
  }

  const data = await req.json();
  const keys = ['a', 'c', 's'];
  if (!keys.every(key => key in data)) {
    return NextResponse.json({ error: 'Invalid code data' }, { status: 400 })
  }

  // Check the signature is well formed.
  const codeMatch = codePattern.exec(data['c']);
  if (!codeMatch) {
    return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 })
  }

  const code = parseInt(codeMatch[1]);
  if (code > REFERRAL_CODE_LIMIT) {
    return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 })
  }

  // Check the signature is valid
  if (!(await verifyReferralCode(data['c'], data['s'], data['a']))) {
    return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 })
  }

  // Check user is not already referred.
  if (await isReferred(walletAddress)) {
    return NextResponse.json({ error: 'Already referred' }, { status: 400 })
  }

  // Check referral code hasn't been used.
  const publicClient = createPublicClient({
    transport: http(JSON_RPC_ENDPOINT)
  })
  if (await referralCodeRedeemed(publicClient, data['a'], code)) {
    return NextResponse.json({ error: 'Code redeemed' }, { status: 400 })
  }

  const key = `${walletAddress}-referral`;
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

      const signedResponse = await signReferral(walletAddress, data['a'], code);
      await redis.set(key, { signedResponse }, { ex: ATTESTATION_DEADLINE });
      return NextResponse.json({ signedResponse })
    }
    finally {
      await lock.release()
    }
  } else {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 })
  }

}
