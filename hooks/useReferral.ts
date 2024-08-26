import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

type Referral = {
    code?: string,
    address?: string,
    signature?: string
}

export function useReferral() {

  const [referral, setReferral] = useState<Referral>({})

  const searchParams = useSearchParams();
  const referralCode = searchParams && searchParams.get('c');
  const referralAddress = searchParams && searchParams.get('a');
  const referralSignature = searchParams && searchParams.get('s');
  const hasReferral = (
    referralCode !== null &&
    referralAddress !== null &&
    referralSignature !== null
  );
  if (hasReferral) {
    if (Object.keys(referral).length === 0) {
      setReferral({
        'code': referralCode,
        'address': referralAddress,
        'signature': referralSignature
      })
    }
  }
  return referral;
}
