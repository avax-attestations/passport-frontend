import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import type { Address } from 'viem'
import { Chain as ViemChain, avalanche, avalancheFuji, hardhat } from 'viem/chains';

export const redisConf = {
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
}

export const ATTESTATION_DEADLINE = 60 * 5;

const supportedChains = [
  avalanche,
  avalancheFuji
] as ViemChain[]

const prodChains = supportedChains as [ViemChain, ...ViemChain[]]

const devChains = ([
  hardhat,
] as ViemChain[]).concat(supportedChains) as [ViemChain, ...ViemChain[]]

export const isProd = process.env.NODE_ENV === 'production'
export const chains = isProd ? prodChains : devChains
export const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

export const PROXY_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PROXY_CONTRACT_ADDRESS! as Address;

if (!PROXY_CONTRACT_ADDRESS) {
  throw new Error('PROXY_CONTRACT_ADDRESS is not set')
}

export const PRIVATE_KEY = process.env.PRIVATE_KEY!;

export const DIAMOND_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_DIAMOND_TOKEN_ADDRESS! as Address;

export const ATTESTATION_CONFIG = {
    'diamond-hand': {
        schemaUID: process.env.NEXT_PUBLIC_DIAMOND_HAND_SCHEMA,
        encoder: new SchemaEncoder('bool hasDiamondHand'),
    },
    'twitter': {
       schemaUID: process.env.NEXT_PUBLIC_TWITTER_ID_SCHEMA,
       encoder: new SchemaEncoder('string twitterId'),
    },
    'github': {
        schemaUID: '0x6723811a6182bcb2fde3035b69a8e3bb854f1ff76413b71d5673ed653208d7ac',
        encoder: new SchemaEncoder('string githubId'),
    },
    'volume': {
        schemaUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
        encoder: new SchemaEncoder('uint256 USDVolume'),
    }
};

export const JSON_RPC_ENDPOINT = (() => {
  if (process.env.RPC_PROVIDER) {
    return process.env.RPC_PROVIDER;
  }

  if (isProd) {
    return 'https://avalanche-fuji-c-chain-rpc.publicnode.com/';
  }
})();

