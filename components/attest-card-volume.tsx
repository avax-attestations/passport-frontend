import { FC } from 'react'

import { Button } from "@/components/ui/button"
import { BaseAttestCard } from "@/components/attest-card"
import { useVolumeReward } from "@/hooks/useVolumeReward"

export type AttestCardVolumeProps = {
  name: string,
  volume: number,
  attestedVolume: number,
  attestVolume: () => void
}

export const AttestCardVolume: FC<AttestCardVolumeProps> = ({
  name,
  volume,
  attestedVolume,
  attestVolume,
}) => {
  const reward = useVolumeReward(volume - attestedVolume)
  return (
    <BaseAttestCard name={name} reward={reward}>
      {volume ? (
        <><p>You have Dex volume {volume} USD, attested {attestedVolume}!</p>
          {attestedVolume == volume ? <p>No volume to attest</p> :
            <Button variant="passport" type="button" onClick={attestVolume}>Attest</Button>}</>
      ) : (
        <p>You do not have dex volume to attest</p>)}
    </BaseAttestCard>
  )
}
