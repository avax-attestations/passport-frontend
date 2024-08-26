import type { Address } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'

import { getReferral } from '@/lib/referral';


export function useGenerateReferral(address: Address) {
  const publicClient = usePublicClient();
  const walletClient = useWalletClient();

  return async (code: number|undefined = undefined) => {
    return await getReferral(address, walletClient, publicClient, code)
  }
}
