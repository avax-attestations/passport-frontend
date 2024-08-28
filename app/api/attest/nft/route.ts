import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

import { getRedisInstance } from "@/lib/redis";
import { Lock } from "@upstash/lock";
import { ATTESTATION_DEADLINE } from "@/lib/config";
import { getWalletAddress } from "@/lib/utils";

import { NFT_COLLECTIONS } from '@/lib/config';
import { hasItemForTime, attestedCollection } from '@/lib/joepegs'
import { signNFT } from '@/lib/signing/nft';

export const runtime = "edge";


export async function GET(req: NextRequest) {
  const session = await auth();
  if (session === undefined || session === null) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 400 })
  }
  const walletAddress = getWalletAddress(session)

  const url = new URL(req.url)
  const collection = url.searchParams.get("collection")
  if (collection === null) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  const collectionConfig = NFT_COLLECTIONS[collection]

  const success = await hasItemForTime(
    walletAddress,
    collectionConfig.address,
    collectionConfig.holdTime
  )
  return NextResponse.json({success: success})
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
  const url = new URL(req.url)
  const collection = url.searchParams.get("collection")
  if (collection === null) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  const collectionConfig = NFT_COLLECTIONS[collection]

  if (await attestedCollection(walletAddress, collection)) {
    return NextResponse.json({ error: 'User has attestation' }, { status: 400 })
  }

  if (!(await hasItemForTime(
    walletAddress,
    collectionConfig.address,
    collectionConfig.holdTime
  ))) {
    return NextResponse.json({ error: "Haven't held nft" }, { status: 400 })
  }

  const key = `${walletAddress}-${collection}`;
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

      const signedResponse = await signNFT(walletAddress, collection);
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
