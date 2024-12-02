import { FC, PropsWithChildren } from 'react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import Image from 'next/image'
import type { Address } from 'viem'
import { REFERRAL_CODE_LIMIT } from "@/lib/config";
import { useGenerateReferral } from '@/hooks/useGenerateReferral';
import { useReferralUsedBy } from "@/hooks/useReferralUsedBy";
import { zeroAddress } from 'viem';
import { useState } from 'react'
import { Check, Copy } from 'lucide-react';

import { Button } from "@/components/ui/button"
import { useShortener } from '@/hooks/useShortener'

export type AttestCardReferralProps = {
  hasReferral: boolean
  isAttested: boolean
  isRootReferrer: boolean
  walletAddress: Address
  attest?: () => void
}

interface ReferralProps {
  walletAddress: Address,
  code: number
}

function ReferralCode({ walletAddress, code }: ReferralProps) {
  const generateReferral = useGenerateReferral(walletAddress);
  const redeemedBy = useReferralUsedBy(walletAddress, code);
  const disabled = redeemedBy != zeroAddress;
  const [link, setLink] = useState('');
  const shortener = useShortener()

  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className='mt-2 w-full'>
      {link ? (<div className="flex flex-row-reverse">
        <div className='ml-3'>
          <button
            onClick={copyToClipboard}
            className="m-0"
          >
            {isCopied ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <Copy className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
        <pre className='overflow-hidden'>{link}</pre>
      </div>) :
        <div>
          <Button
            disabled={disabled}
            variant="passport"
            type="button"
            onClick={async () => {
              setLink(await shortener(await generateReferral(code)))
            }}>
            ({code})&nbsp;
            {disabled ? `Referral Code Used by ${redeemedBy}` : 'Generate Referral Link'}
          </Button>
        </div>
      }
    </div>
  )
}

interface GenerateReferralsProps {
  walletAddress: Address
}


const GenerateReferrals: FC<GenerateReferralsProps> = ({
  walletAddress
}) => {

  const codes = Array.from({ length: REFERRAL_CODE_LIMIT }, (_, i) => i + 1);
  return (
    <div className='flex flex-col items-center w-full'>
      {codes.map((code) => (
        <ReferralCode key={code} walletAddress={walletAddress} code={code} />
      ))}
    </div>
  )
}

interface CardProps {
  walletAddress: Address
}
const Card: FC<PropsWithChildren<CardProps>> = ({ walletAddress, children }) => {
  let usedCodeCount = 0;

  for (let i = 1; i <= REFERRAL_CODE_LIMIT; i++) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const redeemedBy = useReferralUsedBy(walletAddress, i);
    const disabled = redeemedBy != zeroAddress;
    if (disabled) {
      usedCodeCount++;
    }
  }

  return (
    <div className="rounded-sm w-full pl-5 pr-5 sm:pl-0 sm:pr-0 flex flex-col sm:flex-row mt-5">
      <div className="rounded-t-sm bg-passport-card-background flex items-center w-full pb-10 pt-10 ">
        <Image className='m-auto' src={`/card-logos/referral.png`} alt="referral" width={75} height={75} />
      </div>
      <div className="rounded-b-sm flex flex-col pb-2 pl-5 bg-passport-card-background-darker w-full">
        <h1 className="text-3xl mt-6 mb-12">Referral Program</h1>
        <div className='mb-3 flex flex-row'>
          <div>
            <span>Referrals:</span><span>{REFERRAL_CODE_LIMIT}</span>
          </div>
          <div className='ml-12'>
            <span>Used:</span><span>{usedCodeCount}</span>
          </div>
        </div>
        <div className="text-gray-300 font-normal text-sm flex flex-col justify-between w-full">
          {children}
        </div>
      </div>
    </div>
  )
}

export const AttestCardReferral: FC<AttestCardReferralProps> = ({
  hasReferral,
  isAttested,
  isRootReferrer,
  walletAddress,
  attest
}) => {
  if (!hasReferral && isRootReferrer) {
    return (
      <Card walletAddress={walletAddress}>
        <GenerateReferrals walletAddress={walletAddress} />
      </Card>
    )
  }

  return (
    <Card walletAddress={walletAddress}>
      <GenerateReferrals walletAddress={walletAddress} />
      {
        hasReferral ? (
          <>
            <p>You have a referral code!</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="passport" type="button" onClick={attest}>Attest</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This will require a transaction to be signed</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        ) : (
          <p>You do not have a referral code</p>
        )
      }
    </Card>
  )
}
