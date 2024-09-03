import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import type { Address } from 'viem'
import { Chain as ViemChain, avalanche, avalancheFuji, hardhat } from 'viem/chains';

export const redisConf = {
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
}

export const ATTESTATION_DEADLINE = 60 * 5;

const prodChains = [avalanche] as ViemChain[]

const stagingChains = [avalancheFuji] as ViemChain[]

const devChains = ([
  hardhat,
] as ViemChain[]).concat(prodChains).concat(stagingChains)

export const isProd = process.env.NODE_ENV === 'production'
export const chains = (() => {
  if (!isProd) {
    return devChains
  }

  if (process.env.PROD_CHAIN) {
    return prodChains
  }

  return stagingChains
})() as [ViemChain, ...ViemChain[]]

export const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

export const PROXY_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PROXY_CONTRACT_ADDRESS! as Address;

if (!PROXY_CONTRACT_ADDRESS) {
  throw new Error('PROXY_CONTRACT_ADDRESS is not set')
}

export const PRIVATE_KEY = process.env.PRIVATE_KEY!;

export const DIAMOND_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_DIAMOND_TOKEN_ADDRESS! as Address;

export const ATTESTATION_CONFIG = {
    'diamond-hand': {
        schemaUID: process.env.NEXT_PUBLIC_DIAMOND_HAND_SCHEMA! as string,
        encoder: new SchemaEncoder('bool hasDiamondHand'),
    },
    'twitter': {
       schemaUID: process.env.NEXT_PUBLIC_TWITTER_ID_SCHEMA! as string,
       encoder: new SchemaEncoder('string twitterId'),
    },
    'github': {
        schemaUID: '0x6723811a6182bcb2fde3035b69a8e3bb854f1ff76413b71d5673ed653208d7ac',
        encoder: new SchemaEncoder('string githubId'),
    },
    'volume': {
        schemaUID: process.env.NEXT_PUBLIC_VOLUME_SCHEMA! as string,
        encoder: new SchemaEncoder('uint256 volume'),
    },
    'referral': {
        schemaUID: process.env.NEXT_PUBLIC_REFERRAL_SCHEMA! as string,
        encoder: new SchemaEncoder('address referrer,uint256 code')
    }

};

export const EAS_ADDRESS = process.env.NEXT_PUBLIC_EAS_ADDRESS! as Address;

export const JSON_RPC_ENDPOINT = (() => {
  if (process.env.RPC_PROVIDER) {
    return process.env.RPC_PROVIDER;
  }

  if (isProd) {
    return 'https://avalanche-fuji-c-chain-rpc.publicnode.com/';
  }
})();


export const dexVolumeResource = (address: string) => {
    return `https://barn.traderjoexyz.dev/v1/user-lifetime-stats/avalanche/users/${address}/swap-stats`;
}

export const REFERRAL_CODE_LIMIT = process.env.NEXT_PUBLIC_REFERRAL_CODE_LIMIT! as unknown as number;
export const REFERRAL_RESOLVER_ADDRESS = process.env.NEXT_PUBLIC_REFERRAL_RESOLVER_ADDRESS! as Address;
export const REFERRAL_MESSAGE_PREFIX = 'dh-avax-';

export const SHORT_URL_TTL = 60*60*24*30;  // 30 days.
export const JOE_API_KEY = process.env.JOE_API_KEY! as string;
