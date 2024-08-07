import { useMutation } from '@tanstack/react-query';
import type { Address, PublicClient } from 'viem'
import { jsonParseBigInt } from "@/lib/utils"
import { ethers, Typed } from 'ethers';
import { usePublicClient } from 'wagmi'
import { useSigner } from "@/hooks/useSigner";
import { getProxy } from '@/lib/proxy';
import proxyABI from '@/lib/proxy-abi';

import { useEffect, useState } from 'react';

import { PROXY_CONTRACT_ADDRESS } from "@/lib/config"

async function check(client: PublicClient, address: Address, attestationType: string) {
  const attestationCount = await client.readContract({
    address: PROXY_CONTRACT_ADDRESS,
    abi: proxyABI,
    functionName: 'userAuthenticationCount',
    args: [address, attestationType],
  })
  if (!attestationCount) {
    return false;
  }
  return true;
}

export function useAttest(kind: string, address: Address) {
  const [proxy, setProxy] = useState<ethers.Contract| null>(null)
  const signer = useSigner()
  const client = usePublicClient();
  const [isAttested, setIsAttested] = useState(false);

  useEffect(() => {
    if (signer) {
      setProxy(getProxy(signer));
    }
  }, [signer])

  useEffect(() => {
    if (!client) {
      return;
    }

    check(client, address, kind).then((isAttested) => {
      setIsAttested(isAttested);
    }).catch(console.error)

  }, [client, address, kind])

  const attestMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/attest/${kind}`, {
        method: 'POST'
      })
      const data = await res.json()
      const response = jsonParseBigInt(data.signedResponse)
      if (!proxy) {
        // TODO use toast or something similar to report an error, though I think we should never reach this point
        return
      }
      try {
        const tx = await proxy.attestByDelegation(
          Typed.string(kind), {
          schema: response.message.schema,
          data: {
            recipient: response.message.recipient,
            data: response.message.data,
            revocable: response.message.revocable,
            expirationTime: 0,
            refUID: ethers.ZeroHash,
            value: 0,
          },
          attester: response.message.attester,
          signature: response.signature,
          deadline: response.message.deadline,
        })
        await tx.wait();

        if (client) {
          const isAttested = await check(client, address, kind);
          setIsAttested(isAttested);
        }

      } catch (err) {
        // This shouldn't happen but ethers doesn't seem to like
        // function overloading.
        console.error(err)
      }
    }
  })

  function attest() {
    attestMutation.mutate()
  }

  return {
    attest,
    isAttested
  }
}
