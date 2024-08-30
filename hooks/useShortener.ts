import { fetchShortLink } from '@/lib/shortener';


export function useShortener() {

  return async(url: string) => {
    return await fetchShortLink(url);
  }
}
