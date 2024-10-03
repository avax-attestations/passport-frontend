import { type NextRequest, NextResponse } from "next/server";

import { recolorAvatar, headerLogoBuffer } from "@/lib/avatar-image-processing";

function pngResponse(buffer: Buffer, cacheControl?: string) {
  const headers: HeadersInit = {
    'Content-Type': 'image/png'
  }
  if (cacheControl) {
    headers['Cache-Control'] = cacheControl;
  }
  return new NextResponse(buffer, { headers });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const walletAddress = searchParams.get('walletAddress');

  if (!walletAddress) {
    // return 404 if no wallet address is provided
    return new NextResponse(null, { status: 404 });
  }

  try {
    // Generate the recolored avatar based on the static import
    const recoloredAvatarBuffer = await recolorAvatar(walletAddress);

    // Return the modified avatar image as a PNG
    return pngResponse(recoloredAvatarBuffer,
                       'max-age=86400');
  } catch (error) {
    console.error('Error generating avatar:', error);
    return pngResponse(headerLogoBuffer);
  }

}
