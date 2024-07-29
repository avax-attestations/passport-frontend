import type { Address, PublicClient } from 'viem'
import { usePublicClient } from 'wagmi'

import { DIAMOND_TOKEN_ADDRESS } from "@/lib/config"
import { useEffect, useState } from 'react';
import erc20ABI from '@/lib/erc20-abi.json';


async function check(client: PublicClient, address: Address) {
  return await client.readContract({
    address: DIAMOND_TOKEN_ADDRESS,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [address],
  })
}

export function useDiamondBalance(address: Address) {
  const client = usePublicClient();
  const [diamondBalance, setDiamondBalance] = useState(BigInt(0));

  useEffect(() => {
    if (!client) {
      return;
    }
    const promise = check(client, address);
    promise.then((balance) => {
      setDiamondBalance(balance);
    }).catch(console.error)

  }, [client, address])
  return diamondBalance;
}
