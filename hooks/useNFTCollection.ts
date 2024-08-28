import type { Address } from 'viem'
import { useEffect, useState } from 'react';
import { fetchHasItemForTime } from '@/lib/joepegs';


export function useNFTCollection(collection: string, address: Address) {
  const [hasItem, setHasItem] = useState(false);

  useEffect(() => {
    const promise = fetchHasItemForTime(collection);
    promise.then((success) => {
      setHasItem(success);
    }).catch(console.error)
  }, [address])
  return hasItem;
}
