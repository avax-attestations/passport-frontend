import { usePublicClient } from 'wagmi'

import { useEffect, useState } from 'react';
import { rewardFor } from '@/lib/reward';


export function useReward(name: string) {
  const client = usePublicClient();
  const [reward, setReward] = useState('');

  useEffect(() => {
    if (!client) {
      return
    }
    const promise = rewardFor(name, client);
    promise.then((rewardAmount) => {
     setReward(rewardAmount)
    }).catch(console.error)
  })
  return reward;
}
