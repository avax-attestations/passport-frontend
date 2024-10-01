import { useMutation } from '@tanstack/react-query';
import type { Address, PublicClient } from 'viem'
import { decodeEventLog } from 'viem'
import { jsonParseBigInt } from "@/lib/utils"
import { ethers, Typed } from 'ethers';
import { usePublicClient } from 'wagmi'
import { useSigner } from "@/hooks/useSigner";
import { getProxy } from '@/lib/proxy';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import proxyABI from '@/lib/proxy-abi';
import easABI from '@/lib/eas-abi';
import { useSearchParams } from 'next/navigation'

import { useEffect, useState } from 'react';

import { PROXY_CONTRACT_ADDRESS, AASSCAN_URL } from "@/lib/config"

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

async function getAttestationUid(hash: `0x${string}`, client: PublicClient) {
  const txReceipt = await client.getTransactionReceipt({ hash })
  if (!txReceipt) {
    return null;
  }
  const logs = txReceipt.logs;
  if (!logs) {
    return null;
  }
  const uids = []
  for (const log of logs) {
    try {
      const decodedLog = decodeEventLog({
        abi: easABI,
        ...log
      })

      if (decodedLog.eventName === 'Attested') {
        uids.push(decodedLog.args.uid);
      }
    } catch (_err) {
      continue
    }
  }
  if (uids.length !== 1) {
    console.warn('Expected exactly one attestation log, got', uids.length)
    return null;
  }
  return uids[0]
}

export function useAttest(kind: string, address: Address, attestUrl?: string) {
  const [proxy, setProxy] = useState<ethers.Contract | null>(null)
  const signer = useSigner()
  const client = usePublicClient();
  const params = useSearchParams();
  const [isAttested, setIsAttested] = useState(false);
  const { toast } = useToast();

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
      const url = attestUrl ? attestUrl : `/api/attest/${kind}`;
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(params ? Object.fromEntries(params.entries()) : {})
      })
      const data = await res.json()
      if (res.status !== 200) {
        toast({
          variant: 'destructive',
          title: `Error attesting ${kind}`,
          duration: 5000,
          description: data.error
        })
        return
      }
      const response = jsonParseBigInt(data.signedResponse)
      if (!proxy) {
        // TODO use toast or something similar to report an error, though I think we should never reach this point
        return
      }
      try {
        const startToast = toast({
          title: `Attesting ${kind}`,
          description: 'This may take a few seconds...',
          duration: 10000
        })
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
        const receipt = await tx.wait();
        const hash = receipt.hash;
        startToast.dismiss();
        const attestationUid = client && hash ? await getAttestationUid(hash, client) : '';
        const attestationUrl = `${AASSCAN_URL}/attestation?uid=${attestationUid}&chain=${client?.chain?.name}`
        if (client) {
          const isAttested = await check(client, address, kind);
          setIsAttested(isAttested);
        }

        toast({
          title: `Attested ${kind}`,
          description: `Successfully attested ${kind}`,
          action: <ToastAction altText="View on aasscan.org"
            onClick={() => window.open(attestationUrl)}
          >View on aasscan.org</ToastAction>,
          duration: 10000
        })
      } catch (err) {
        // This shouldn't happen but ethers doesn't seem to like
        // function overloading.
        console.error(err)
        toast({
          variant: 'destructive',
          title: `Error attesting ${kind}`,
          duration: 5000,
          description: (err as Error).message
        })
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
