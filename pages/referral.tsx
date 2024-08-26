import type { Address } from 'viem'
import { useAuth, type Auth } from "@/hooks/useAuth";
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { ConnectHeader } from "@/components/connect-header"
import { useGenerateReferral } from '@/hooks/useGenerateReferral';
import { useDiamondBalance } from "@/hooks/useDiamondBalance";
import { REFERRAL_CODE_LIMIT } from "@/lib/config";
import { useReferralUsedBy } from "@/hooks/useReferralUsedBy";
import { zeroAddress } from 'viem';

interface SignedInProps {
  session: Auth['session']
  csrfToken: Auth['csrfToken']
  signOut: Auth['signOut']
}

interface ReferralProps {
  walletAddress: Address,
  code: number
}

function ReferralCode({walletAddress, code} : ReferralProps) {
  const generateReferral = useGenerateReferral(walletAddress);
  const redeemedBy = useReferralUsedBy(walletAddress, code);
  const disabled = redeemedBy != zeroAddress;
  const [link, setLink] = useState('');

  return (
    <>
      <div><h3>Code: {code}</h3></div>
      <div>
        <Button
          disabled={disabled}
          variant="passport"
          type="button"
          onClick={async () => {
            setLink(await generateReferral(code))
          }}>
          Generate Referral Link ({code})
        </Button>
      </div>
      <div>{link}</div>
      <div>
        <p>Used by: { redeemedBy }</p>
      </div>
    </>
  )
}


function Main({ session }: SignedInProps) {

  const userName = session?.user?.userName ?? 'Anonymous';
  const walletAddress = session?.user?.sub
  const totalPoints = useDiamondBalance(walletAddress);


  return (
    <>
      <Header
        userName={userName}
        isConnected={true}
        walletAddress={walletAddress}
        score={totalPoints} />
      { walletAddress && (
        <>

          <ReferralCode walletAddress={walletAddress} code={1} />
          <ReferralCode walletAddress={walletAddress} code={2} />
          <ReferralCode walletAddress={walletAddress} code={3} />
        </>
      )}
    </>
  )
}

export default function Referral() {
  const { session, csrfToken, signIn, signOut } = useAuth()

  return (
    <main className="flex flex-col items-center justify-between pt-5">
      <div className="w-full sm:w-[640px] md:w-[768px] lg:w-[1024px]">
        <ConnectHeader
          signedIn={!!session}
          csrfToken={csrfToken}
          onSignIn={signIn}
          onSignOut={signOut} />

        <Main
          csrfToken={csrfToken}
          session={session}
          signOut={signOut}
        />
      </div>
    </main>
  );
}
