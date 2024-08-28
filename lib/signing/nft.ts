'use server';

import type { Address } from 'viem';
import { JsonRpcProvider, Wallet } from "ethers";
import { EIP712Proxy } from "@ethereum-attestation-service/eas-sdk/dist/eip712-proxy";
import {
  PROXY_CONTRACT_ADDRESS,
  PRIVATE_KEY,
  ATTESTATION_CONFIG,
  JSON_RPC_ENDPOINT,
  NFT_COLLECTIONS
} from "@/lib/config"
import { jsonStringifyBigInt } from "@/lib/utils"
import { ATTESTATION_DEADLINE } from "@/lib/config";


export async function signNFT(address: Address, collection: string) {
  const provider = new JsonRpcProvider(JSON_RPC_ENDPOINT)
  const signer = new Wallet(PRIVATE_KEY, provider);
  const proxy = new EIP712Proxy(PROXY_CONTRACT_ADDRESS, { signer: signer })

  const delegated = await proxy.getDelegated()

  const attestationType = ATTESTATION_CONFIG[collection];
  const collectionConfig = NFT_COLLECTIONS[collection];

  const params = {
    schema: attestationType.schemaUID,
    recipient: address,
    expirationTime: 0n,
    revocable: false,
    refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
    data: attestationType.encoder.encodeData([{
      name: 'collection',
      type: 'address',
      value: collectionConfig.address
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
