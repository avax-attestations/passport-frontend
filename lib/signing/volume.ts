'use server';

import type { Address } from 'viem';
import { EIP712Proxy } from "@ethereum-attestation-service/eas-sdk/dist/eip712-proxy";
import { JsonRpcProvider, Wallet } from 'ethers';
import { ATTESTATION_CONFIG, PROXY_CONTRACT_ADDRESS } from '@/lib/config';
import { jsonStringifyBigInt } from "@/lib/utils"
import { PRIVATE_KEY } from "@/lib/config";
import { ATTESTATION_DEADLINE } from "@/lib/config";



export async function signVolume(address: Address, volumeToAttest: number) {
  const provider = new JsonRpcProvider(process.env.RPC_PROVIDER);
  const signer = new Wallet(PRIVATE_KEY, provider)

  const proxy = new EIP712Proxy(PROXY_CONTRACT_ADDRESS, { signer: signer })

  const attestationType = ATTESTATION_CONFIG['volume'];

  const delegated = await proxy.getDelegated();

  const params = {
    schema: attestationType.schemaUID,
    recipient: address,
    expirationTime: 0n,
    revocable: true,
    refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
    data: attestationType.encoder.encodeData([{
      name: 'volume',
      type: 'uint256',
      value: volumeToAttest,
    }]),
    value: 0n,
    deadline: BigInt(Math.floor(new Date().getTime() / 1000) + ATTESTATION_DEADLINE),
  };

  const response = await delegated.signDelegatedProxyAttestation(params, signer);
  return jsonStringifyBigInt({
    message: response.message,
    signature: response.signature,
  })

}
