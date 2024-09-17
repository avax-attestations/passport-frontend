import type { Address, PublicClient } from 'viem'
import { formatEther, encodeAbiParameters} from 'viem';
import proxyAbi from '@/lib/proxy-abi';
import { PROXY_CONTRACT_ADDRESS } from '@/lib/config';


async function getRewarderAddress(
  attestationType: string,
  client: PublicClient,
): Promise<Address> {
  const [,rewarderAddress,] = await client.readContract({
    address: PROXY_CONTRACT_ADDRESS,
    abi: proxyAbi,
    functionName: 'attestationTypes',
    args: [attestationType],
  }) as [any, Address, any];
  return rewarderAddress;
}


const rewarderABI = [{
  "type":"function",
  "name":"rewardFor",
  "inputs":[{
    "name":"attestationData",
    "type":"bytes",
  }],
  "outputs":[{
    "type":"uint256",
  }],
  "stateMutability":"view"
}]

async function getReward(
  rewarder: Address,
  client: PublicClient,
  data: string
): Promise<bigint> {
  const reward = await client.readContract({
    address: rewarder,
    abi: rewarderABI,
    functionName: 'rewardFor',
    args: [data],
  }) as bigint;
  return reward;
}


export async function rewardFor(
  name: string,
  client: PublicClient
): Promise<string> {
  const rewarder = await getRewarderAddress(name, client);
  const amount = await getReward(rewarder, client, '0x');
  return formatEther(amount)
}


export async function volumeRewardFor(
  client: PublicClient,
  volume: number
): Promise<string> {
  const rewarder = await getRewarderAddress('volume', client);
  const data = encodeAbiParameters([
    { name: 'volume', type: 'uint256'}
  ], [
    BigInt(volume)
  ]);
  const amount = await getReward(rewarder, client, data);
  return formatEther(amount)
}
