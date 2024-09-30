import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import sharp from 'sharp';

const imagePath = path.join(process.cwd(), 'public', 'header-logo.png');
export const headerLogoBuffer = fs.readFileSync(imagePath);

/**
 * Generate a deterministic color from a wallet address.
 * @param walletAddress - The user's wallet address
 * @returns A number representing the color adjustment factor.
 */
const generateColorFactorFromWallet = (walletAddress: string): number => {
    const hash = crypto.createHash('md5').update(walletAddress).digest('hex');
    const colorFactor = parseInt(hash.slice(0, 6), 16) % 360; // HSL hue value between 0-360
    return colorFactor;
};

/**
 * Apply color transformation to an avatar image based on the wallet address.
 * @param avatarBuffer - Buffer of the original PNG avatar
 * @param walletAddress - The user's wallet address
 * @returns A buffer containing the transformed PNG image
 */
export const recolorAvatar = async (walletAddress: string): Promise<Buffer> => {
    const colorFactor = generateColorFactorFromWallet(walletAddress);

    // Use Sharp to apply a color transformation (e.g., hue rotation)
    const recoloredAvatar = await sharp(headerLogoBuffer)
        .modulate({
            hue: colorFactor, // Adjust hue based on the wallet address
            saturation: 1.2,  // Slightly increase saturation (optional)
            brightness: 1.1   // Slightly increase brightness (optional)
        })
        .png()
        .toBuffer();

    return recoloredAvatar;
};

