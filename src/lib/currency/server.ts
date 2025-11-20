/**
 * Server-side currency utilities
 */

import { headers } from 'next/headers'
import { getCurrencyFromCountry, type CurrencyCode } from './converter'

/**
 * Detect user's currency based on their location
 * Uses Vercel's geo headers or Cloudflare's CF-IPCountry
 */
export async function detectUserCurrency(): Promise<CurrencyCode> {
    const headersList = await headers()

    // Try Vercel's geo headers first (preferred for Vercel deployments)
    const vercelCountry = headersList.get('x-vercel-ip-country')
    if (vercelCountry) {
        return getCurrencyFromCountry(vercelCountry)
    }

    // Try Cloudflare headers
    const cfCountry = headersList.get('cf-ipcountry')
    if (cfCountry) {
        return getCurrencyFromCountry(cfCountry)
    }

    // Fallback to USD
    return 'USD'
}

/**
 * Get user's country code from headers
 */
export async function getUserCountry(): Promise<string | null> {
    const headersList = await headers()

    return headersList.get('x-vercel-ip-country') ||
        headersList.get('cf-ipcountry') ||
        null
}
