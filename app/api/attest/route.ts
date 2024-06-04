import { type NextRequest, NextResponse } from "next/server";
import { JsonRpcProvider, Wallet } from "ethers";
import { auth } from "@/lib/auth";
import { EIP712Proxy } from "@ethereum-attestation-service/eas-sdk/dist/eip712-proxy";
import { isDiamondHands } from "@/lib/diamond-hands"
import { jsonStringifyBigInt } from "@/lib/utils"

import {
  PROXY_CONTRACT_ADDRESS,
  PRIVATE_KEY,
  DIAMOND_HANDS_SCHEMA_UID,
  DIAMOND_HANDS_ATTESTATION_DATA,
  TWITTER_SCHEMA_UID,
  GITHUB_SCHEMA_UID,
  twitterEncoder,
  githubEncoder
} from "@/lib/config"


if (!PROXY_CONTRACT_ADDRESS) {
  throw new Error('PROXY_CONTRACT_ADDRESS is not set')
}

if (!PRIVATE_KEY) {
  throw new Error('PRIVATE_KEY is not set')
}

export const runtime = "edge";

function getWalletAddress(session: any) {
  return session.user.sub
}

export async function POST(req: NextRequest) {
  const session = await auth()
  const walletAddress = getWalletAddress(session)

  if (!walletAddress) {
    return NextResponse.json({ error: 'No wallet address found in session' }, { status: 400 })
  }

  const payload = await req.json()
  let params;
  switch(payload.schemaId) {

    case DIAMOND_HANDS_SCHEMA_UID: {

      if (!isDiamondHands(walletAddress)) {
        return NextResponse.json({ error: 'User is not diamond hands' }, { status: 400 })
      }

      params = {
        schema: DIAMOND_HANDS_SCHEMA_UID,
        recipient: walletAddress,
        expirationTime: 0n,
        revocable: false,
        refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
        data: DIAMOND_HANDS_ATTESTATION_DATA,
        value: 0n,
        deadline: 0n
      };
      break;

    }
    case TWITTER_SCHEMA_UID: {
       // TODO Make sure they have a twitter ID in the JWT.
       params = {
        schema: TWITTER_SCHEMA_UID,
        recipient: walletAddress,
        expirationTime: 0n,
        revocable: false,
        refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
        data: twitterEncoder.encodeData([{
          name: 'twitterId',
          type: 'uint256',
          value: session.user?.linkedAccounts?.['twitter']
        }]),
        value: 0n,
        deadline: 0n
       }
       break;
    }
    case GITHUB_SCHEMA_UID: {
       // TODO Make sure they have a twitter ID in the JWT.
       params = {
        schema: GITHUB_SCHEMA_UID,
        recipient: walletAddress,
        expirationTime: 0n,
        revocable: false,
        refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
        data: githubEncoder.encodeData([{
          name: 'githubId',
          type: 'string',
          value: session.user?.linkedAccounts?.['github']
        }]),
        value: 0n,
        deadline: 0n
       }
       break;
    }

    default: {
      return NextResponse.json({ error: 'Invalid schema' }, { status: 400 })

    }
  }

  const provider = new JsonRpcProvider('http://localhost:8545/')  // TODO: env variable
  const signer = new Wallet(PRIVATE_KEY, provider);

  const proxy = new EIP712Proxy(PROXY_CONTRACT_ADDRESS, { signer: signer })

  const delegated = await proxy.getDelegated()

  const response = await delegated.signDelegatedProxyAttestation(params, signer);
  const signedResponse = jsonStringifyBigInt({
    message: response.message,
    signature: response.signature,
  })

  return NextResponse.json({ signedResponse })
}
