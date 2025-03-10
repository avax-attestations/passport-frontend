import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import type { Address } from 'viem'
import { Chain as ViemChain, avalanche, avalancheFuji, hardhat } from 'viem/chains';

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

  if (process.env.NEXT_PUBLIC_PROD_CHAIN) {
    return prodChains
  }

  return stagingChains
})() as [ViemChain, ...ViemChain[]]

export const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

export const PROXY_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PROXY_CONTRACT_ADDRESS! as Address;

if (!PROXY_CONTRACT_ADDRESS) {
  throw new Error('PROXY_CONTRACT_ADDRESS is not set')
}

export const AASSCAN_URL = process.env.NEXT_PUBLIC_AASSCAN_URL!
if (!AASSCAN_URL) {
  throw new Error('AASSCAN_URL is not set')
}

export const PRIVATE_KEY = process.env.PRIVATE_KEY!;

export const DIAMOND_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_DIAMOND_TOKEN_ADDRESS! as Address;

interface AttestationType {
    schemaUID: string
    encoder: SchemaEncoder
}
interface AttestationConfig {
    [key: string]: AttestationType
}

export const ATTESTATION_CONFIG: AttestationConfig = {
    'diamond-hand': {
        schemaUID: process.env.NEXT_PUBLIC_DIAMOND_HAND_SCHEMA! as string,
        encoder: new SchemaEncoder('bool hasDiamondHand'),
    },
    'twitter': {
       schemaUID: process.env.NEXT_PUBLIC_TWITTER_ID_SCHEMA! as string,
       encoder: new SchemaEncoder('string twitterId'),
    },
    'volume': {
        schemaUID: process.env.NEXT_PUBLIC_VOLUME_SCHEMA! as string,
        encoder: new SchemaEncoder('uint256 volume'),
    },
    'referral': {
        schemaUID: process.env.NEXT_PUBLIC_REFERRAL_SCHEMA! as string,
        encoder: new SchemaEncoder('address referrer,uint256 code')
    },
    'smol-joes': {
        schemaUID: process.env.NEXT_PUBLIC_NFT_HOLDER_SCHEMA! as string,
        encoder: new SchemaEncoder('address collection')
    },
    'og-smol-joes': {
        schemaUID: process.env.NEXT_PUBLIC_NFT_HOLDER_SCHEMA! as string,
        encoder: new SchemaEncoder('address collection')
    },
    'nochillio': {
        schemaUID: process.env.NEXT_PUBLIC_NFT_HOLDER_SCHEMA! as string,
        encoder: new SchemaEncoder('address collection')
    },
    'bruskies': {
        schemaUID: process.env.NEXT_PUBLIC_NFT_HOLDER_SCHEMA! as string,
        encoder: new SchemaEncoder('address collection')
    },
    'peons': {
        schemaUID: process.env.NEXT_PUBLIC_NFT_HOLDER_SCHEMA! as string,
        encoder: new SchemaEncoder('address collection')
    },
    'steady': {
        schemaUID: process.env.NEXT_PUBLIC_NFT_HOLDER_SCHEMA! as string,
        encoder: new SchemaEncoder('address collection')
    },
    'yield-yak-airdrop': {
        schemaUID: process.env.NEXT_PUBLIC_YIELD_YAK_AIRDROP_SCHEMA! as string,
        encoder: new SchemaEncoder('bool hasYieldYakAirdrop'),
    },
    'avalanche-ambassador': {
        schemaUID: process.env.NEXT_PUBLIC_AVALANCHE_AMBASSADOR_SCHEMA! as string,
        encoder: new SchemaEncoder('bool isAvalancheAmbassador'),
    },


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
    return `https://api.traderjoexyz.dev/v1/user-lifetime-stats/avalanche/users/${address}/swap-stats`;
}

export const REFERRAL_CODE_LIMIT = process.env.NEXT_PUBLIC_REFERRAL_CODE_LIMIT! as unknown as number;
export const REFERRAL_RESOLVER_ADDRESS = process.env.NEXT_PUBLIC_REFERRAL_RESOLVER_ADDRESS! as Address;
export const REFERRAL_MESSAGE_PREFIX = 'dh-avax-';

export const SHORT_URL_TTL = 60*60*24*30;  // 30 days.
export const JOE_API_KEY = process.env.JOE_API_KEY! as string;
export const DEX_API_KEY = process.env.DEX_API_KEY! as string;

interface NFTCollection {
    [key: string]: any
}
export const NFT_COLLECTIONS: NFTCollection = {
  'smol-joes': {
    address: '0xb449701a5ebb1d660cb1d206a94f151f5a544a81',
    holdTime: 60 * 60 * 24 * 365,  // 1 year
  },
  'og-smol-joes': {
    address: '0x5bEb759F7769193a8e401bb2d7CaD22bACb930d5',
    holdTime: 30 * 60 * 24 * 365,  // half year
  },
  'nochillio': {
    address: '0x204b3EE3f9bDCDe258BA3F74dE76ea8Eedf0A36A',
    holdTime: 60 * 60 * 24, // one day
  },
  'bruskies': {
    address: '0xb563420b7b8119114968C70093c4966630ad16d3',
    holdTime: 60 * 60 * 24,
  },
  'peons': {
    address: '0xe6cc79ca731a5e406024015bb2de5346b52eca2f',
    holdTime: 30 * 60 * 24 * 365,
  },
  'steady': {
    address: '0xcdAB7d987f0198EDB440D014ed1E71256A0e3e7A',
    holdTime: 30 * 60 * 24 * 365,
  }
}
