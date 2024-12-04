import type { Address } from 'viem'
import { getProxy } from "@/lib/proxy";
import { JsonRpcProvider } from "ethers";
import { JOE_API_KEY } from '@/lib/config';
import { JSON_RPC_ENDPOINT } from "@/lib/config"


// Utility function for joepegs API queries.
async function fetchJSON(url: string) {
  // TODO: Support pagination.
  try {
    const response = await fetch(url, {
      headers: {
        "x-joepegs-api-key": JOE_API_KEY,
      }
    });
    if (!response.ok) {
      throw new Error(`${url} - Response status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(error.message);
  }
}


interface Activity {
    fromAddress: string
    toAddress: string
    timestamp: number
}
interface Item {
    tokenId: string
    lastTransfer: Activity
}


// Get all the tokens for a given owner in a collection.
export async function fetchCollectionItems(address: Address, collection: Address) : Promise<Array<Item>> {
  const url = `https://api-internal.joepegs.dev/v3/users/${address}/items?collectionAddresses=${collection}`;
  return await fetchJSON(url);
}


// Get all the transfer events for a given item.
export async function fetchItemActivities(collection: Address, tokenId: string) : Promise<Array<Activity>> {
  const url = `https://api-internal.joepegs.dev/v3/activities/avalanche/${collection}/tokens/${tokenId}?filters=transfer&filters=mint`
  return await fetchJSON(url);
}
// Returns true if a user has held any token in a given collection
// for a time period. It does this by checking when the token was
// transferred to the users address.
export async function hasItemForTime(address:Address, collection: Address, seconds: number) {
  seconds + 1;
  // Get the token ID's the users items.
  const tokenIds = (
    await fetchCollectionItems(address, collection)
  ).map(item => item.tokenId);
  // Get the latest transfer events for each token.
  const activities: Item[] = await Promise.all(tokenIds.map(async tokenId => {
    return {
      tokenId: tokenId,
      lastTransfer: (await Promise.all(
        await fetchItemActivities(collection, tokenId as Address)
      )).map(activity => {
        return {fromAddress: activity.fromAddress, toAddress: activity.toAddress, timestamp: activity.timestamp as unknown as number};
      }).reduce((prev, current) =>
        (prev && prev.timestamp > current.timestamp) ? prev : current
      )
    }
  }));

  // Check if any of the activities are over `seconds` ago.
  const now = Math.floor(Date.now() / 1000);
  return activities.some(
    (activity) => now - activity.lastTransfer.timestamp > seconds
  );
}


export async function fetchHasItemForTime(collection: string) {
  const url = '/api/attest/nft?';
  try {
    const response = await fetch(url + new URLSearchParams({
      collection: collection,
    }).toString());
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    return json.success;
  } catch (error: any) {
    console.error(error.message);
  }
}


export async function attestedCollection(address: Address, collectionName: string) {
  const provider = new JsonRpcProvider(JSON_RPC_ENDPOINT)
  const proxy = getProxy(provider);
  return (await proxy.userAuthenticationCount(address, collectionName)) >= 1;
}
