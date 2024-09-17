import { usePublicClient } from 'wagmi'

import { useEffect, useState } from 'react';
import { volumeRewardFor } from '@/lib/reward';


export function useVolumeReward(volume: number) {
  const client = usePublicClient();
  const [reward, setReward] = useState('');

  useEffect(() => {
    if (!client) {
      return
    }
    const promise = volumeRewardFor(client, volume);
    promise.then((rewardAmount) => {
     setReward(rewardAmount)
    }).catch(console.error)
  })
  return reward;
}
