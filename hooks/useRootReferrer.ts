import type { Address } from 'viem'
import { zeroAddress } from 'viem'
import { usePublicClient } from 'wagmi'
import { useEffect, useState } from 'react';

import { rootReferrer } from '@/lib/referral';


export function useRootReferrer() {
  const [wallet, setWallet] = useState(zeroAddress as Address)
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!publicClient) {
      return
    }
    const promise = rootReferrer(publicClient)
    promise.then((wallet) => {
      setWallet(wallet);
    }).catch(console.error);
  }, [publicClient])

  return wallet;
}
