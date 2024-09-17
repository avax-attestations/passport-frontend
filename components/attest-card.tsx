import { FC, PropsWithChildren } from 'react'
import Image from 'next/image'
import { useReward } from '@/hooks/useReward';


export type BaseAttestCardProps = PropsWithChildren<{
  name: string,
  reward: string
}>


export const BaseAttestCard: FC<BaseAttestCardProps> = ({
  name,
  reward,
  children
}) => {
  return (
    <div className="rounded-sm w-full pl-5 pr-5 sm:pl-0 sm:pr-0 sm:w-[205px] md:w-[245px] lg:w-[330px] mt-5">
      <div className="rounded-t-sm bg-passport-card-background flex flex-col items-center w-full pb-10 pt-10">
        <Image src={`/card-logos/${name}.png`} alt={`${name} connection`} width={75} height={75} />
      </div>
      <div className="rounded-b-sm flex flex-col pl-5 pr-5 pt-10 pb-2 bg-passport-card-background-darker">
        <p className="text-white font-semibold mb-5">
        {name.toUpperCase()}
        </p>
        <div className="text-gray-300 font-normal h-24 text-sm flex flex-col justify-between">
        Reward: {reward} Diamonds
        {children}
        </div>
      </div>
    </div>
  )
}


export type AttestCardProps = PropsWithChildren<{
  name: string,
}>


export const AttestCard: FC<AttestCardProps> = ({
  name,
  children
}) => {
  const reward = useReward(name)
  return (
    <BaseAttestCard name={name} reward={reward}>
      {children}
    </BaseAttestCard>
  )
}
