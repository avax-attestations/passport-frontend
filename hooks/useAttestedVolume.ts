import type { Address } from 'viem';

import { useEthersProvider } from '@/lib/ethers-adapter'
import { getProxy} from '@/lib/proxy';
import { useEffect, useState } from 'react';
import { getAttestedVolume } from '@/lib/volume';


export function useAttestedVolume(address: Address) {
  const provider = useEthersProvider()
  const [attestedVolume, setAttestedVolume] = useState(0);

  useEffect(() => {
    if (provider) {
      const proxy = getProxy(provider)
      const promise = getAttestedVolume(address, provider, proxy);
      promise.then((volume) => {
        setAttestedVolume(volume);
      }).catch(console.error);
    }
  }, [provider, address])
  return attestedVolume;
}
