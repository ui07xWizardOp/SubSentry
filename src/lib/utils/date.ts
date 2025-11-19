import { DateTime } from 'luxon'

export type BillingCycle = 'weekly' | 'monthly' | 'yearly'

/**
 * Calculate the next renewal date based on the start date and billing cycle
 */
export function calculateNextRenewalDate(
    startDate: string,
    billingCycle: BillingCycle
): string {
    const start = DateTime.fromISO(startDate, { zone: 'utc' })
    const now = DateTime.now().toUTC()

    let next = start

    // Find the next renewal date after today
    while (next <= now) {
        switch (billingCycle) {
            case 'weekly':
                next = next.plus({ weeks: 1 })
                break
            case 'monthly':
                next = next.plus({ months: 1 })
                break
            case 'yearly':
                next = next.plus({ years: 1 })
                break
        }
    }

    return next.toISODate() || ''
}

/**
 * Calculate days until a renewal date
 */
export function daysUntilRenewal(renewalDate: string): number {
    const renewal = DateTime.fromISO(renewalDate, { zone: 'utc' })
    const now = DateTime.now().toUTC()

    return Math.ceil(renewal.diff(now, 'days').days)
}

/**
 * Convert normalized monthly spend to different billing cycles
 */
export function convertToMonthlySpend(amount: number, billingCycle: BillingCycle): number {
    switch (billingCycle) {
        case 'weekly':
            return amount * 4.33 // Average weeks per month
        case 'monthly':
            return amount
        case 'yearly':
            return amount / 12
    }
}

/**
 * Convert normalized monthly spend to yearly
 */
export function convertToYearlySpend(monthlySpend: number): number {
    return monthlySpend * 12
}
