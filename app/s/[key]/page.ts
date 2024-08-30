import { redirect } from 'next/navigation';
import { getLink } from '@/lib/shortener';
import { notFound } from 'next/navigation'


export const runtime = "edge";


export default async function Page({params} : { params: { key: string}}) {
  const link = await getLink(params.key);
  if (!link) {
    return notFound();
  }
  redirect(link);
}

