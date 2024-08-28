
import { FC, PropsWithChildren } from 'react'
import Image from 'next/image'

import { Button } from "@/components/ui/button"
import { AttestCard } from "@/components/attest-card"

export type AttestCardNFTCollectionProps = {
  name: string
  description: string
  hasValidItem: boolean
  isAttested: boolean
  attest?: () => void
  holdTime: number
}

export const AttestCardNFTCollection: FC<AttestCardNFTCollectionProps> = ({
  name,
  description,
  hasValidItem,
  isAttested,
  attest,
  holdTime
}) => {
  return (
    <AttestCard name={name}>
      { isAttested ? (
        <p>Already attested</p>
      ) : (
        hasValidItem ? (
          <>
            <Button variant="passport" type="button" onClick={attest}>Attest</Button>
          </>
        ) : (
          <>
            <p>You have not held an item for {holdTime} seconds</p>
          </>
        )
      )}
    </AttestCard>
  )
}
