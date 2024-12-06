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
import { isYieldYakAirdrop } from "@/lib/yield-yak"
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
  const yieldYakAirdrop = isYieldYakAirdrop(walletAddress)
  const { attest: attestDiamondHands, isAttested: isAttestedDiamondHands } = useAttest('diamond-hand', walletAddress)
  const { attest: attestYieldYakAirdrop, isAttested: isAttestedYieldYakAirdrop} = useAttest('yield-yak-airdrop', walletAddress)
  const { attest: attestTwitter, isAttested: isAttestedTwitter } = useAttest('twitter', walletAddress)
  const { attest: attestVolume } = useAttest('volume', walletAddress)
  const { attest: attestReferral, isAttested: isAttestedReferral } = useAttest('referral', walletAddress)
  const { attest: attestSmolJoe, isAttested: isAttestedSmolJoe } = useAttest('smol-joes', walletAddress, '/api/attest/nft?collection=smol-joes')
  const { attest: attestOGSmolJoe, isAttested: isAttestedOGSmolJoe } = useAttest('og-smol-joes', walletAddress, '/api/attest/nft?collection=og-smol-joes')
  const { attest: attestNochillio, isAttested: isAttestedNochillio} = useAttest('nochillio', walletAddress, '/api/attest/nft?collection=nochillio')
  const { attest: attestBruskies, isAttested: isAttestedBruskies} = useAttest('bruskies', walletAddress, '/api/attest/nft?collection=bruskies')
  const { attest: attestPeons, isAttested: isAttestedPeons} = useAttest('peons', walletAddress, '/api/attest/nft?collection=peons')
  const { attest: attestSteady, isAttested: isAttestedSteady} = useAttest('steady', walletAddress, '/api/attest/nft?collection=steady')

  const volume = useTotalVolume(walletAddress);
  const attestedVolume = useAttestedVolume(walletAddress);

  const referral = useReferral();
  const rootReferrer = useRootReferrer();
  const hasReferral = Object.keys(referral).length !== 0;
  const hasSmolJoeForTime = useNFTCollection('smol-joes', walletAddress);
  const hasOGSmolJoeForTime = useNFTCollection('og-smol-joes', walletAddress);
  const hasNochillioForTime = useNFTCollection('nochillio', walletAddress);
  const hasBruskiesForTime = useNFTCollection('bruskies', walletAddress);
  const hasPeonsForTime = useNFTCollection('peons', walletAddress);
  const hasSteadyForTime = useNFTCollection('steady', walletAddress);

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
          <AttestCardNFTCollection
            name='nochillio'
            description='nochillio nft collection'
            hasValidItem={hasNochillioForTime}
            isAttested={isAttestedNochillio}
            attest={attestNochillio}
            holdTime={NFT_COLLECTIONS['nochillio'].holdTime}
          />
          <AttestCardNFTCollection
            name='bruskies'
            description='bruskies nft collection'
            hasValidItem={hasBruskiesForTime}
            isAttested={isAttestedBruskies}
            attest={attestBruskies}
            holdTime={NFT_COLLECTIONS['bruskies'].holdTime}
          />
          <AttestCardNFTCollection
            name='peons'
            description='peons nft collection'
            hasValidItem={hasPeonsForTime}
            isAttested={isAttestedPeons}
            attest={attestPeons}
            holdTime={NFT_COLLECTIONS['peons'].holdTime}
          />
        <AttestCardNFTCollection
            name='steady'
            description='steady nft collection'
            hasValidItem={hasSteadyForTime}
            isAttested={isAttestedSteady}
            attest={attestSteady}
            holdTime={NFT_COLLECTIONS['steady'].holdTime}
          />

          <AttestCard name="yield-yak-airdrop">
            {yieldYakAirdrop ? (
              <><p>You have YieldYak Airdrop!</p>
                {isAttestedYieldYakAirdrop ? <p>Already attested</p> :
                  <Button variant="passport" type="button" onClick={attestYieldYakAirdrop}>Attest</Button>}</>
            ) : (
              <p>You do not have the YieldYak airdrop</p>)}
          </AttestCard>

          {/* filler div to remove the "hole" between the two smol joe cards */}
          {/* <div className="sm:w-[205px] md:w-[245px] lg:w-[330px]"></div> */}

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

        { session?.user?.sub && <Main
          csrfToken={csrfToken}
          session={session}
          signOut={signOut}
        /> }
      </div>
      <Toaster />
    </main>
  );
}
