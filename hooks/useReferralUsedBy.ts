import type { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { useEffect, useState } from 'react';

import { codeRedeemedBy } from '@/lib/referral';


export function useReferralUsedBy(
  address: Address,
  code: number
) {
  const [user, setUser] = useState('')
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!publicClient) {
      return
    }
    const promise = codeRedeemedBy(publicClient, address, code)
    promise.then((usedBy) => {
      setUser(usedBy);
    }).catch(console.error);
  }, [address])

  return user;
}
