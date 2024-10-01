const ethers = require('ethers');
const crypto = require('crypto');

const wallet = ethers.Wallet.createRandom();
const jwtSecret = crypto.randomBytes(16).toString('hex');

console.log('GITHUB_ID=')
console.log('GITHUB_SECRET=')
console.log('TWITTER_ID=')
console.log('TWITTER_SECRET=')
console.log(`JWT_SECRET=${jwtSecret}`)
console.log(`PRIVATE_KEY=${wallet.privateKey}`)
console.log('NEXT_PUBLIC_PROXY_CONTRACT_ADDRESS=0xECDCC3b19ff99fbc10C7D38eF1b3F99816800000')
console.log('NEXT_PUBLIC_DIAMOND_HAND_SCHEMA=0x806aa3254e7b01104e2cb55d4a2db500f6c12c4f9d92ee3aca1d414ce02a3597')
console.log('NEXT_PUBLIC_TWITTER_ID_SCHEMA=0x5dd1160c15fcc616c4c9f77e8bacff98d31f9519d7d1b94c03a970be787ae011')
console.log('NEXT_PUBLIC_DIAMOND_TOKEN_ADDRESS=0x3059957DeBDdFAa2FD5b5056d2162D3628Ee09EE')
console.log('NEXT_PUBLIC_AASSCAN_URL=http://localhost:3001')
