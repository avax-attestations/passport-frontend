import { useAuth, type Auth } from "@/hooks/useAuth";
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image'
import { SiweMessage } from "siwe";
import { ConnectKitButton } from 'connectkit';
import { EIP712Proxy } from "@ethereum-attestation-service/eas-sdk/dist/eip712-proxy";
import type { Address, Chain } from 'viem'
import { useAccount, useSignMessage } from "wagmi"
import { Button } from "@/components/ui/button"
import { jsonParseBigInt } from "@/lib/utils"

import { PROXY_CONTRACT_ADDRESS, TWITTER_SCHEMA_UID, GITHUB_SCHEMA_UID, DIAMOND_HANDS_SCHEMA_UID } from "@/lib/config"

import { isDiamondHands } from "@/lib/diamond-hands"
import { useSigner } from "@/hooks/useSigner";
import { useEffect, useState } from "react";
import { useIsAttested } from "@/hooks/useIsAttested";

interface SignedOutProps {
  csrfToken: Auth['csrfToken']
  signIn: Auth['signIn']
  address?: Address
  chain?: Chain
  signMessageAsync: ReturnType<typeof useSignMessage>['signMessageAsync']
}

function SignedOut({ csrfToken, signIn, address, chain, signMessageAsync }: SignedOutProps) {
  async function handleSignIn() {
    if (!csrfToken || !address) {
      return;
    }

    const message = new SiweMessage({
      domain: window.location.host,
      address: address,
      statement: "Sign in with Ethereum",
      uri: window.location.origin,
      version: "1",
      chainId: chain?.id,
      nonce: csrfToken,
    })

    const signature = await signMessageAsync({
      message: message.prepareMessage()
    })

    signIn({ message: JSON.stringify(message), signature })
  }

  return (
    <Button type="button" onClick={() => {
      handleSignIn()
    }}>Login</Button>
  )
}

interface SocialConnection {
  name: string,
  schema: Address,
  linked: string,
  connectUrl: string,
  description: string,
  buttonLabel: string
}

interface SocialAttestationProps {
  social: SocialConnection,
  csrfToken: string,
  session: NonNullable<Auth['session']>,
  attestMutation: any
}

function SocialAttestationProvider({
  social,
  csrfToken,
  session,
  attestMutation
}: SocialAttestationProps) {

  const isAttested = useIsAttested(session.user?.sub, social.schema)
  return (
    <div key={social.name} className="mr-10 mt-10 flex flex-col items-center justify-between bg-gray-100 border rounded-sm p-5 w-[300px] h-[200px]">
      <Image src={`/${social.name}.png`} alt={`${social.name} connection`} width={75} height={75} />
      {social.linked ? (<>
        <p>Connected as {social.linked}</p>
          {isAttested ? <p>Already attested</p> :
            <Button type="button" onClick={() => {
              attestMutation.mutate({schemaId: social.schema})
            }}>Attest</Button>
          }
        </>
      ) : (<>
        <p>{social.description}</p>
        <form action={social.connectUrl} method="post">
          <input type="hidden" name="csrfToken" value={csrfToken} />
          <input type="hidden" name="callbackUrl" value={window.location.origin} />
          <Button type="submit">{social.buttonLabel}</Button>
        </form></>)
      }
    </div>
  )
}


interface DiamondHandAttestationProps{
  session: NonNullable<Auth['session']>,
  attestMutation: any,
  schema: Address
}

function DiamondHandAttestationProvider({ session, attestMutation, schema }: DiamondHandAttestationProps) {
  const diamondHands = isDiamondHands(session.user?.sub)
  const isAttestedDiamondHand = useIsAttested(session.user?.sub, schema)

  return (
    <div className="mr-10 mt-10 flex flex-col items-center justify-between bg-gray-100 border rounded-sm p-5 w-[300px] h-[200px]">
      <Image src={`/diamond.png`} alt={`Is diamond hands`} width={75} height={75} />
      {diamondHands ? (
        <><p>You have diamond hands!</p>
          {isAttestedDiamondHand ? <p>Already attested</p> :
          <Button type="button" onClick={() => {
            attestMutation.mutate({schemaId: schema})
          }}>Attest</Button>}</>
      ) : (
        <p>You do not have diamond hands</p>)}
    </div>
  )
}

interface SignedInProps {
  session: NonNullable<Auth['session']>
  csrfToken: Auth['csrfToken']
  signOut: Auth['signOut']
}

interface AttestMutationVariables {
  schemaId: string
}

function SignedIn({ session, signOut, csrfToken }: SignedInProps) {
  const signer = useSigner()
  const [proxy, setProxy] = useState<EIP712Proxy | null>(null)

  useEffect(() => {
    if (signer) {
      setProxy(new EIP712Proxy(PROXY_CONTRACT_ADDRESS, { signer: signer }))
    }
  }, [signer])


  const attestMutation = useMutation({
    mutationFn: async (variables: AttestMutationVariables) => {
      const res = await fetch('/api/attest', {
        method: 'POST',
        body: JSON.stringify({schemaId: variables.schemaId}),
      })
      const data = await res.json()
      const response = jsonParseBigInt(data.signedResponse)
      if (!proxy) {
        // TODO use toast or something similar to report an error, though I think we should never reach this point
        console.error('not connected!')
        return
      }

      const tx = await proxy.attestByDelegationProxy({
        schema: response.message.schema,
        data: {
          recipient: response.message.recipient,
          data: response.message.data,
          revocable: response.message.revocable,
        },
        attester: response.message.attester,
        signature: response.signature,
      })
      await tx.wait();
    }
  })

  const socialConnections = [{
    name: 'github',
    schema: GITHUB_SCHEMA_UID,
    linked: session.user?.linkedAccounts?.['github'],
    connectUrl: '/api/auth/signin/github',
    description: 'Link Github account',
    buttonLabel: 'Connect'
  }, {
    name: 'twitter',
    schema: TWITTER_SCHEMA_UID,
    linked: session.user?.linkedAccounts?.['twitter'],
    connectUrl: '/api/auth/signin/twitter',
    description: 'Link Twitter/X account',
    buttonLabel: 'Connect'
  }]

  let totalPoints = 0;
  for (const connection of socialConnections) {
    if (connection.linked) {
      totalPoints += 50;
    }
  }

  return (
    <div className="flex flex-col items-center">
      <Button type="button" onClick={() => {
        signOut()
      }}>Logout</Button>

      <h1 className="text-2xl font-semibold mt-5">{session.user?.sub} (total points: {totalPoints})</h1>

      <div className="flex flex-wrap mt-10">

        {socialConnections.map((social) => (
          <SocialAttestationProvider
            key={social.name}
            social={social}
            session={session}
            attestMutation={attestMutation}
            csrfToken={csrfToken}
          />
        ))}
        <DiamondHandAttestationProvider schema={DIAMOND_HANDS_SCHEMA_UID} session={session} attestMutation={attestMutation} />
      </div>
    </div>
  )
}


export default function Home() {
  const { signMessageAsync } = useSignMessage()
  const { session, csrfToken, signIn, signOut } = useAuth()
  const { address, chain, isConnected } = useAccount()

  return (
    <main className="flex flex-col items-center justify-between pt-5">

      {!isConnected ? (
        <div>
          <ConnectKitButton />
        </div>
      ) : session ?
        <SignedIn
          csrfToken={csrfToken}
          session={session}
          signOut={signOut}
        /> :
        <SignedOut
          csrfToken={csrfToken}
          signIn={signIn}
          address={address}
          chain={chain}
          signMessageAsync={signMessageAsync}
        />}
    </main>
  );
}
