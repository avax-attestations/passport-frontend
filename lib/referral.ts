import type { Address, PublicClient, Signature } from 'viem'
import { verifyMessage } from 'viem';
import { getProxy } from "@/lib/proxy";
import { ethers, JsonRpcProvider } from "ethers";
import { JSON_RPC_ENDPOINT, REFERRAL_CODE_LIMIT, REFERRAL_RESOLVER_ADDRESS } from "@/lib/config"
import referralResolverAbi from '@/lib/referral-resolver-abi';


export async function isReferred(address: Address) {
  const provider = new JsonRpcProvider(JSON_RPC_ENDPOINT)
  const proxy = getProxy(provider);
  return (await proxy.userAuthenticationCount(address, 'referral')) != 0;
}


export async function codeRedeemedBy(
  client: PublicClient,
  referrer: Address,
  code: number,
): Promise<Address> {
  const user = await client.readContract({
    address: REFERRAL_RESOLVER_ADDRESS,
    abi: referralResolverAbi,
    functionName: 'referralCodes',
    args: [referrer, code],
  }) as Address;
  return user;
}


export async function referralCodeRedeemed(
  client: PublicClient,
  referrer: Address,
  code: number,
) {
  return (await codeRedeemedBy(client, referrer, code)) !== ethers.ZeroAddress;
}


export async function nextUnclaimedReferral(address: Address, client: PublicClient) {
  // Note referral codes start from 1.
  // 0 is used to represent no codes available.
  for (let i = 1; i <= REFERRAL_CODE_LIMIT ; i++) {
    if (!(await referralCodeRedeemed(client, address, i))) {
      return i;
    }
  }
  return 0
}


// TODO: any type removal.
// NOTE: we just use EIP-191 format here
// not EIP-712. This signature won't go
// on-chain ever and is just used by the webapp
// before signing the referral attestation.
export async function signReferralCode(
  address: Address,
  walletClient: any,
  code: number,
) {
  return await walletClient.data.signMessage({
    address,
    message: `${code}`,
  })
}


export async function verifyReferralCode(
  referralCode: string,
  referralSignature: Signature,
  referralAddress: Address,
) {
  return await verifyMessage({
    address: referralAddress,
    message: referralCode,
    signature: referralSignature,
  })
}


export async function getReferral(
  address: Address,
  walletClient: any,
  publicClient: any,
  code: number|undefined = undefined
) {
  if (code === undefined) {
    code = await nextUnclaimedReferral(address, publicClient);
    if (code === 0) {
      return '';
    }
  }
  const signature = await signReferralCode(address, walletClient, code);
  return `${window.location.origin}?a=${address}&c=${code}&s=${signature}`;
}
