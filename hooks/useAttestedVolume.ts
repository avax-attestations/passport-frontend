import type { Address } from 'viem';

import { useSigner } from '@/hooks/useSigner'
import { getProxy} from '@/lib/proxy';
import { useEffect, useState } from 'react';
import { getAttestedVolume } from '@/lib/volume';


export function useAttestedVolume(address: Address) {
  const signer = useSigner()
  const [attestedVolume, setAttestedVolume] = useState(0);

  useEffect(() => {
    if (signer) {
      const proxy = getProxy(signer)
      const promise = getAttestedVolume(address, signer, proxy);
      promise.then((volume) => {
        setAttestedVolume(volume);
      }).catch(console.error);
    }
  }, [signer, address])
  return attestedVolume;
}
