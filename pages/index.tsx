import { useAuth, type Auth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button"
import { AttestCard } from "@/components/attest-card"
import { AttestCardSocialConnection } from "@/components/attest-card-social-connection"
import { Header } from "@/components/header"
import { ConnectHeader } from "@/components/connect-header"

import { isDiamondHands } from "@/lib/diamond-hands"
import { useIsAttested } from "@/hooks/useIsAttested";
import { useAttest } from "@/hooks/useAttest";
import { useDiamondBalance } from "@/hooks/useDiamondBalance";
import { useAttestedVolume } from "@/hooks/useAttestedVolume";
import { useTotalVolume } from "@/hooks/useTotalVolume";

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
  const githubLinked = session?.user?.linkedAccounts?.['github']
  const twitterLinked = extractTwitterUsername(session?.user?.linkedAccounts?.['twitter'])
  const walletAddress = session?.user?.sub

  const diamondHands = isDiamondHands(walletAddress)
  const isAttestedDiamondHands = useIsAttested(walletAddress, 'diamond-hand')
  const isAttestedTwitter = useIsAttested(walletAddress, 'twitter')
  const { attest: attestDiamondHands } = useAttest('diamond-hand')
  const { attest: attestTwitter } = useAttest('twitter')
  const { attest: attestVolume} = useAttest('volume')

  const volume = useTotalVolume(walletAddress);
  const attestedVolume  = useAttestedVolume(walletAddress);

  const socialConnections = [{
    name: 'github',
    linked: githubLinked,
    connectUrl: '/api/auth/signin/github',
    description: 'Link Github account',
    connectedDescription: `Connected as "${githubLinked}"`,
    buttonLabel: 'Connect',
    isAttested: false,
  }, {
    name: 'twitter',
    linked: twitterLinked,
    connectUrl: '/api/auth/signin/twitter',
    description: 'Link Twitter/X account',
    connectedDescription: `Connected as "${twitterLinked}"`,
    buttonLabel: 'Connect',
    isAttested: isAttestedTwitter,
    attest: attestTwitter
  },]

  const totalPoints = useDiamondBalance(walletAddress);

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

          <AttestCard name="diamond">
            {diamondHands ? (
              <><p>You have diamond hands!</p>
                {isAttestedDiamondHands ? <p>Already attested</p> :
                  <Button variant="passport" type="button" onClick={attestDiamondHands}>Attest</Button>}</>
            ) : (
              <p>You do not have diamond hands</p>)}
          </AttestCard>

          <AttestCard name="volume">
            {volume ? (
              <><p>You have Dex volume { volume } USD, attested { attestedVolume }!</p>
                {attestedVolume == volume ? <p>No volume to attest</p> :
                  <Button variant="passport" type="button" onClick={attestVolume}>Attest</Button>}</>
            ) : (
              <p>You do not have dex volume to attest</p>)}
          </AttestCard>

        </div>)}
    </>
  )
}

export default function Home() {
  const { session, csrfToken, signIn, signOut } = useAuth()

  return (
    <main className="flex flex-col items-center justify-between pt-5">
      <div className="sm:w-[640px] md:w-[768px] lg:w-[1024px]">
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
