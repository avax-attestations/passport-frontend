import type { Address } from 'viem';

import { useEthersProvider } from '@/lib/ethers-adapter'
import { getProxy} from '@/lib/proxy';
import { useEffect, useState } from 'react';
import { getAttestedVolume } from '@/lib/volume';
import { ethers, Wallet } from 'ethers';


export function useAttestedVolume(address: Address) {
  const provider = useEthersProvider()
  const [attestedVolume, setAttestedVolume] = useState(0);

  useEffect(() => {
    if (provider) {
      const proxy = getProxy(provider)
      // This wallet with null key is because `EAS` requires an
      // object with interface including a `sendTransaction` function.
      // We only query contracts here but I'm not sure of another
      // way to keep type system happy.
      const wallet = new Wallet(
        '0x0000000000000000000000000000000000000000000000000000000000000001',
        provider
      );
      const promise = getAttestedVolume(address, wallet, proxy);
      promise.then((volume) => {
        setAttestedVolume(volume);
      }).catch(console.error);
    }
  }, [provider, address])
  return attestedVolume;
}
