import { ethers } from 'ethers';
import proxyABI from './proxy-abi';
import { PROXY_CONTRACT_ADDRESS } from '@/lib/config'


export function getProxy(signerOrProvider: ethers.JsonRpcSigner | ethers.JsonRpcProvider | ethers.FallbackProvider) {
  return new ethers.Contract(
    PROXY_CONTRACT_ADDRESS,
    proxyABI,
    signerOrProvider
  );
}
