import type { Address } from 'viem';

import { useEffect, useState } from 'react';
import { getTotalVolume } from '@/lib/volume';


export function useTotalVolume(address: Address) {
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    const promise = getTotalVolume(address);
    promise.then((volume) => {
     if (volume !== undefined) {
       setVolume(volume);
     }
    }).catch(console.error)
  }, [address])
  return volume;
}
