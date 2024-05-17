import type { Address } from 'viem'
import { createPublicClient, http } from 'viem'
import { hardhat } from 'viem/chains'

import { PROXY_CONTRACT_ADDRESS } from '@/lib/config'
import { abi } from '@/lib/PassportEIP712Proxy.json'


// TODO: This shouldn't be hardcoded to hardhat
// and should be instantiated in another file and
// imported here.
const publicClient = createPublicClient({
  chain: hardhat,
  transport: http(),
});


export async function userAttestation(
  address: Address,
  schema: string,  // Should this be bytes32 type?
  includeRevoked: boolean = false,
): Promise<string[]> {

  const attestationCount: number = await publicClient.readContract({
    address: PROXY_CONTRACT_ADDRESS,
    abi: abi,
    functionName: 'userAuthenticationCount',
    args: [address, schema],
  });

  const attestationIds: string[] = [];
  for (let i = 0; i < attestationCount; i++) {
    const [attestationId, revoked]: [attestationId: string, revoked: boolean] = await publicClient.readContract({
     address: PROXY_CONTRACT_ADDRESS,
     abi: abi,
     functionName: 'userAuthenticationCount',
     args: [address, schema],
    });
    if (revoked && !includeRevoked) continue;
    attestationIds.push(attestationId);
  }
  return attestationIds;

}
