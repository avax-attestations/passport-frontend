'use server';

import type { Address } from 'viem';
import { getProxy } from "@/lib/proxy";
import { JsonRpcProvider, Wallet } from 'ethers';
import { EAS } from "@ethereum-attestation-service/eas-sdk";
import { ATTESTATION_CONFIG, PROXY_CONTRACT_ADDRESS } from '@/lib/config';
import { EIP712Proxy } from "@ethereum-attestation-service/eas-sdk/dist/eip712-proxy";
import { jsonStringifyBigInt } from "@/lib/utils"


const ATTESTATION_TYPE = 'volume';
const provider = new JsonRpcProvider(process.env.RPC_PROVIDER);
const signer = new Wallet(process.env.PRIVATE_KEY, provider)
const proxy = getProxy(undefined, provider);
const eas = new EAS(process.env.EAS_CONTRACT_ADDRESS);
eas.connect(provider);
const attestationType = ATTESTATION_CONFIG[ATTESTATION_TYPE];


// Returns the sum of all volume attested to a given `address`.
// This is done by reading all the attestation UID's made from the proxy
// and then fetching the actual attestation data, decoding it and summing the
// volume.
async function getAttestedVolume(address: Address) {
  let totalVolume = 0;
  const attestationCount = await proxy.userAuthenticationCount(address, ATTESTATION_TYPE);
  for (let i = 0; i < attestationCount; i++) {
    const attestationUID = await proxy.userAuthenticationCount(
      address,
      ATTESTATION_TYPE,
      i
    );
    const attestation = await eas.getAttestation(attestationUID);
    if (!attestation.revocationTime) {
      // XXX Using index 0 is a bit brittle here, properly parse the decoded
      // data by attribute name.
      totalVolume += attestationType.encoder.decodeData(attestation.data)[0].value.value;
    }
  }
  return totalVolume;
}

// Returns the total USD volume for a given address on the
// traderjoe dex.
// NOTE: This function is currently a mock and will need to
// be implemented when the required API's are available.
async function getTotalVolume(address: Address) {
    return Math.floor(Date.now() / 1000);
}


export async function signVolume(address: Address) {
  const totalVolume = getTotalVolume(address);
  const attestedVolume = getAttestedVolume(address);
  const volumeToAttest = totalVolume - attestedVolume;

  const proxy = new EIP712Proxy(PROXY_CONTRACT_ADDRESS, { signer: signer });
  const delegated = await proxy.getDelegated();

  const params = {
    schema: attestationType.schemaUID,
    recipient: address,
    expirationTime: 0n,
    revocable: false,
    refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
    data: attestationType.encoder.encodeData([{
      name: 'USDVolume',
      type: 'uint256',
      value: volumeToAttest,
    }]),
    value: 0n,
    deadline: 0n
  };

  const response = await delegated.signDelegatedProxyAttestation(params, signer);
  return jsonStringifyBigInt({
    message: response.message,
    signature: response.signature,
  })

}
