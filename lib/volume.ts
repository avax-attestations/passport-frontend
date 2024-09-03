import type { Address } from 'viem'
import { EAS } from "@ethereum-attestation-service/eas-sdk";
import { EAS_ADDRESS, ATTESTATION_CONFIG, JOE_API_KEY, dexVolumeResource } from "@/lib/config";
import { ethers, Wallet, JsonRpcSigner } from 'ethers';


export async function getTotalVolume(address: Address) {
  const url = dexVolumeResource(address);
  try {
    const response = await fetch(url, {
      headers: {
        "x-traderjoe-api-key": JOE_API_KEY,
      }
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    return Math.floor(json.volume);
  } catch (error: any) {
    console.error(error.message);
  }
}

// Returns the sum of all volume attested to a given `address`.
// This is done by reading all the attestation UID's made from the proxy
// and then fetching the actual attestation data, decoding it and summing the
// volume.
export async function getAttestedVolume(
  address: Address,
  provider: Wallet | JsonRpcSigner,
  proxy: ethers.Contract
) {
  const eas = new EAS(EAS_ADDRESS);
  eas.connect(provider);
  let totalVolume = 0;
  const attestationCount = await proxy.userAuthenticationCount(address, 'volume');
  for (let i = 0; i < attestationCount; i++) {
    const attestationUID = await proxy.userAuthentication( address, 'volume', i);
    const attestation = await eas.getAttestation(attestationUID);
    if (!attestation.revocationTime) {
      // XXX Using index 0 is a bit brittle here, properly parse the decoded
      // data by attribute name.
      totalVolume += Number(ATTESTATION_CONFIG['volume'].encoder.decodeData(attestation.data)[0].value.value);
    }
  }
  return totalVolume;
}


export async function fetchTotalVolume() {
  const url = '/api/attest/volume';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    return Math.floor(json.volume);
  } catch (error: any) {
    console.error(error.message);
  }
}
