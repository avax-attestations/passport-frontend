import { useAuth, type Auth } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { AttestCard } from "@/components/attest-card"
import { AttestCardSocialConnection } from "@/components/attest-card-social-connection"
import { AttestCardNFTCollection } from "@/components/attest-card-nft-collection"
import { AttestCardReferral } from "@/components/attest-card-referral"
import { AttestCardVolume } from "@/components/attest-card-volume"
import { Header } from "@/components/header"
import { ConnectHeader } from "@/components/connect-header"

import { isDiamondHands } from "@/lib/diamond-hands"
import { useAttest } from "@/hooks/useAttest";
import { useDiamondBalance } from "@/hooks/useDiamondBalance";
import { useAttestedVolume } from "@/hooks/useAttestedVolume";
import { useTotalVolume } from "@/hooks/useTotalVolume";
import { useReferral } from '@/hooks/useReferral';
import { useRootReferrer } from '@/hooks/useRootReferrer';
import { useNFTCollection } from "@/hooks/useNFTCollection";
import { NFT_COLLECTIONS } from "@/lib/config";

interface SignedInProps {
  session: Auth['session']
  csrfToken: Auth['csrfToken']
  signOut: Auth['signOut']
}

function extractTwitterUsername(linkedId?: string) {
  if (!linkedId) {
    return ''
  }
  return linkedId.split(':')[1]
}

function Main({ session, csrfToken }: SignedInProps) {
  const userName = session?.user?.userName ?? 'Anonymous';
  const twitterLinked = extractTwitterUsername(session?.user?.linkedAccounts?.['twitter'])
  const walletAddress = session?.user?.sub

  const diamondHands = isDiamondHands(walletAddress)
  const { attest: attestDiamondHands, isAttested: isAttestedDiamondHands } = useAttest('diamond-hand', walletAddress)
  const { attest: attestTwitter, isAttested: isAttestedTwitter } = useAttest('twitter', walletAddress)
  const { attest: attestVolume } = useAttest('volume', walletAddress)
  const { attest: attestReferral, isAttested: isAttestedReferral } = useAttest('referral', walletAddress)
  const { attest: attestSmolJoe, isAttested: isAttestedSmolJoe } = useAttest('smol-joes', walletAddress, '/api/attest/nft?collection=smol-joes')
  const { attest: attestOGSmolJoe, isAttested: isAttestedOGSmolJoe } = useAttest('og-smol-joes', walletAddress, '/api/attest/nft?collection=og-smol-joes')

  const volume = useTotalVolume(walletAddress);
  const attestedVolume = useAttestedVolume(walletAddress);

  const referral = useReferral();
  const rootReferrer = useRootReferrer();
  const hasReferral = Object.keys(referral).length !== 0;
  const hasSmolJoeForTime = useNFTCollection('smol-joes', walletAddress);
  const hasOGSmolJoeForTime = useNFTCollection('og-smol-joes', walletAddress);

  const socialConnections = [{
    name: 'twitter',
    linked: twitterLinked,
    connectUrl: '/api/auth/signin/twitter',
    description: 'Link Twitter/X account',
    connectedDescription: `Connected as "${twitterLinked}"`,
    buttonLabel: 'Connect',
    isAttested: isAttestedTwitter,
    attest: attestTwitter
  },]

  const totalPoints = useDiamondBalance(walletAddress, [
    attestDiamondHands,
    attestTwitter,
    attestVolume,
    attestReferral,
    attestSmolJoe,
    attestOGSmolJoe
  ]);

  return (
    <>
      <Header
        userName={userName}
        isConnected={true}
        walletAddress={walletAddress}
        score={totalPoints} />

      {walletAddress && (

        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between items-center">

          {isAttestedReferral && (
            <>
              {socialConnections.map((props) => (
                <AttestCardSocialConnection key={props.name} {...props} csrfToken={csrfToken} />
              ))}

              <AttestCard name="diamond-hand">
                {diamondHands ? (
                  <><p>You have diamond hands!</p>
                    {isAttestedDiamondHands ? <p>Already attested</p> :
                      <Button variant="passport" type="button" onClick={attestDiamondHands}>Attest</Button>}</>
                ) : (
                  <p>You do not have diamond hands</p>)}
              </AttestCard>

              <AttestCardVolume
                name="volume"
                volume={volume}
                attestedVolume={attestedVolume}
                attestVolume={attestVolume} />

              <AttestCardNFTCollection
                name='smol-joes'
                description='smol joes nft collection'
                hasValidItem={hasSmolJoeForTime}
                isAttested={isAttestedSmolJoe}
                attest={attestSmolJoe}
                holdTime={NFT_COLLECTIONS['smol-joes'].holdTime}
              />
              <AttestCardNFTCollection
                name='og-smol-joes'
                description='OG smol joes nft collection'
                hasValidItem={hasOGSmolJoeForTime}
                isAttested={isAttestedOGSmolJoe}
                attest={attestOGSmolJoe}
                holdTime={NFT_COLLECTIONS['og-smol-joes'].holdTime}
              />
              {/* filler div to remove the "hole" between the two smol joe cards */}
              <div className="sm:w-[205px] md:w-[245px] lg:w-[330px]">
              </div>
            </>
          )}

          <AttestCardReferral
            hasReferral={hasReferral}
            isAttested={isAttestedReferral}
            attest={attestReferral}
            walletAddress={walletAddress}
            isRootReferrer={rootReferrer === walletAddress} />

        </div>)}
    </>
  )
}

export default function Home() {
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
      <Toaster />
    </main>
  );
}
