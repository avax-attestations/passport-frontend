import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { shorten } from '@/lib/shortener';

export const runtime = "edge";


export async function POST(req: NextRequest) {
  const session = await auth();
  if (session === undefined || session === null) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 400 })
  }
  const data = await req.json();
  if (!data.url) {
    return NextResponse.json({ error: 'Bad payload' }, { status: 400 })
  }
  const shortURL = await shorten(data.url)
  return NextResponse.json({'url': shortURL})

}
