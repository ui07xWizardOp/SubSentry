/**
 * Currency Conversion Utility
 * Uses exchangerate-api.com free tier for live exchange rates
 */

// Supported currencies
export const SUPPORTED_CURRENCIES = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
    { code: 'SGD', symbol: '$', name: 'Singapore Dollar' },
] as const

export type CurrencyCode = typeof SUPPORTED_CURRENCIES[number]['code']

interface ExchangeRateResponse {
    result: string
    rates: Record<string, number>
    time_last_update_unix: number
}

// Cache for exchange rates (24 hours)
let cachedRates: Record<string, number> | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

/**
 * Fetch exchange rates from API
 */
async function fetchExchangeRates(): Promise<Record<string, number>> {
    const now = Date.now()

    // Return cached rates if still valid
    if (cachedRates && (now - cacheTimestamp) < CACHE_DURATION) {
        return cachedRates
    }

    try {
        // Using exchangerate-api.com free tier (1,500 requests/month)
        // Base currency is USD
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')

        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates')
        }

        const data: ExchangeRateResponse = await response.json()

        // Cache the rates
        cachedRates = data.rates
        cacheTimestamp = now

        return data.rates
    } catch (error) {
        console.error('Error fetching exchange rates:', error)

        // Return fallback static rates if API fails
        return getFallbackRates()
    }
}

/**
 * Fallback static rates (approximate, updated quarterly)
 */
function getFallbackRates(): Record<string, number> {
    return {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        INR: 83.12,
        CAD: 1.36,
        AUD: 1.53,
        JPY: 149.50,
        CNY: 7.24,
        CHF: 0.88,
        SGD: 1.34,
    }
}

/**
 * Convert amount from one currency to another
 */
export async function convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string
): Promise<number> {
    if (fromCurrency === toCurrency) {
        return amount
    }

    const rates = await fetchExchangeRates()

    // Convert to USD first (base currency)
    const amountInUSD = amount / rates[fromCurrency]

    // Then convert to target currency
    const convertedAmount = amountInUSD * rates[toCurrency]

    return Math.round(convertedAmount * 100) / 100 // Round to 2 decimals
}

/**
 * Get currency symbol from currency code
 */
export function getCurrencySymbol(currencyCode: string): string {
    const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode)
    return currency?.symbol || '$'
}

/**
 * Get currency name from currency code
 */
export function getCurrencyName(currencyCode: string): string {
    const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode)
    return currency?.name || currencyCode
}

/**
 * Format amount with currency symbol
 */
export function formatCurrency(amount: number, currencyCode: string): string {
    const symbol = getCurrencySymbol(currencyCode)

    // Handle currencies with different formatting (e.g., JPY doesn't use decimals)
    if (currencyCode === 'JPY') {
        return `${symbol}${Math.round(amount).toLocaleString()}`
    }

    return `${symbol}${amount.toFixed(2)}`
}

/**
 * Detect user's currency based on country code
 */
export function getCurrencyFromCountry(countryCode: string): CurrencyCode {
    const countryToCurrency: Record<string, CurrencyCode> = {
        'US': 'USD',
        'GB': 'GBP',
        'IN': 'INR',
        'CA': 'CAD',
        'AU': 'AUD',
        'JP': 'JPY',
        'CN': 'CNY',
        'CH': 'CHF',
        'SG': 'SGD',
        // EU countries
        'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR',
        'NL': 'EUR', 'BE': 'EUR', 'AT': 'EUR', 'PT': 'EUR',
        'IE': 'EUR', 'FI': 'EUR', 'GR': 'EUR',
    }

    return countryToCurrency[countryCode] || 'USD'
}
