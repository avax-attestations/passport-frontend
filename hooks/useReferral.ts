import { useState } from 'react'
import { useSearchParams } from 'next/navigation'


export function useReferral() {

  const [referral, setReferral] = useState({})

  const searchParams = useSearchParams();
  const referralCode = searchParams ? searchParams.get('c') : undefined;
  const referralAddress = searchParams ? searchParams.get('a') : undefined;
  const referralSignature = searchParams ? searchParams.get('s') : undefined;
  const hasReferral = referralCode && referralAddress && referralSignature;

  if (hasReferral) {
    setReferral({
      'c': referralCode,
      'a': referralAddress,
      's': referralSignature
    })
  }
  return referral;
}
