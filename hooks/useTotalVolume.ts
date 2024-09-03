import type { Address } from 'viem';

import { useEffect, useState } from 'react';
import { fetchTotalVolume } from '@/lib/volume';


export function useTotalVolume(address: Address) {
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    const promise = fetchTotalVolume();
    promise.then((volume) => {
     if (volume !== undefined) {
       setVolume(volume);
     }
    }).catch(console.error)
  }, [address])
  return volume;
}
