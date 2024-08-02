import type { Address } from 'viem'
import { EAS } from "@ethereum-attestation-service/eas-sdk";
import { EAS_ADDRESS, ATTESTATION_CONFIG } from "@/lib/config";
import { ethers, Wallet, JsonRpcSigner } from 'ethers';


// Returns the total USD volume for a given address on the
// traderjoe dex.
// NOTE: This function is currently a mock and will need to
// be implemented when the required API's are available.
// TJ API can return USD volume with arbitrary amount of
// decimals however we want to round down to the lowest
// dollar.
export async function getTotalVolume(address: Address) {
    return Math.floor(Date.now() / 10000000);
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
