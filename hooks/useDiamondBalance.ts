import type { Address, PublicClient } from 'viem'
import { usePublicClient } from 'wagmi'

import { DIAMOND_TOKEN_ADDRESS } from "@/lib/config"
import { useEffect, useState } from 'react';
import { erc20Abi } from 'viem'


async function check(client: PublicClient, address: Address) {
  return client.readContract({
    address: DIAMOND_TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address],
  })
}

export function useDiamondBalance(address: Address, deps: Array<() => void>) {
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

  }, [client, address, ...deps])
  return diamondBalance;
}
