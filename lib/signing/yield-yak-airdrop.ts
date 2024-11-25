'use server';

import type { Address } from 'viem';
import { JsonRpcProvider, Wallet } from "ethers";
import { EIP712Proxy } from "@ethereum-attestation-service/eas-sdk/dist/eip712-proxy";
import {
  PROXY_CONTRACT_ADDRESS,
  PRIVATE_KEY,
  ATTESTATION_CONFIG,
  JSON_RPC_ENDPOINT,
} from "@/lib/config"
import { jsonStringifyBigInt } from "@/lib/utils"
import { ATTESTATION_DEADLINE } from "@/lib/config";


export async function signYieldYakAirdrop(address: Address) {
  const provider = new JsonRpcProvider(JSON_RPC_ENDPOINT)
  const signer = new Wallet(PRIVATE_KEY, provider);
  const proxy = new EIP712Proxy(PROXY_CONTRACT_ADDRESS, { signer: signer })

  const delegated = await proxy.getDelegated()

  const attestationType = ATTESTATION_CONFIG['yield-yak-airdrop'];

  const params = {
    schema: attestationType.schemaUID,
    recipient: address,
    expirationTime: 0n,
    revocable: false,
    refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
    data: attestationType.encoder.encodeData([{
      name: 'hasYieldYakAirdrop',
      type: 'bool',
      value: true
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
