import { FC } from 'react'
import Image from 'next/image'
import { formatEther } from 'viem'

export type HeaderProps = {
  isConnected: boolean
  walletAddress: string
  score: bigint
  userName: string
}

export const Header: FC<HeaderProps> = ({
  walletAddress,
  score,
  userName
}) => {

  const headerLogo = walletAddress? '/api/avatar?walletAddress=' + walletAddress : '/header-logo.png'

  return (
    <div>
      <div className="rounded-sm w-full pl-5 pr-5 sm:pl-0 sm:pr-0">
        <div className="rounded-t-sm bg-passport-card-background flex flex-col sm:flex-row justify-between items-left w-full p-5 sm:p-10 overflow-hidden">
          <div className="flex flex-row">
            <Image src={headerLogo} className="mr-4" alt={`Header`} width={100} height={100} />
            <div className="flex flex-col justify-center w-full">
              <span className="text-passport-button font-bold text-2xl">{userName}</span>
              <span className="text-sm">{walletAddress}</span>
            </div>
          </div>
          <div className="flex flex-col justify-center mt-5 sm:mt-0">
            <span className="text-xs">My score:</span>
            <div className="flex flex-row" >
              <span className="font-bold text-2xl">{formatEther(score)}</span>
              <span>&nbsp;diamonds</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
