import { FC, PropsWithChildren } from 'react'
import Image from 'next/image'

export type AttestCardProps = PropsWithChildren<{
  name: string
}>


export const AttestCard: FC<AttestCardProps> = ({
  name,
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
        {children}
        </div>
      </div>
    </div>
  )
}
