import { describe, it, expect } from 'vitest'
import { DateTime } from 'luxon'
import {
    calculateNextRenewalDate,
    daysUntilRenewal,
    convertToMonthlySpend,
    convertToYearlySpend,
} from './date'

describe('Date Utilities', () => {
    describe('calculateNextRenewalDate', () => {
        it('should calculate next renewal for monthly subscription', () => {
            const startDate = '2024-01-15'
            const result = calculateNextRenewalDate(startDate, 'monthly')

            // Should be in the future
            const resultDate = DateTime.fromISO(result, { zone: 'utc' })
            const now = DateTime.now().toUTC()
            expect(resultDate > now).toBe(true)

            // Should be on the 15th of some month
            expect(resultDate.day).toBe(15)
        })

        it('should calculate next renewal for yearly subscription', () => {
            const startDate = '2023-06-01'
            const result = calculateNextRenewalDate(startDate, 'yearly')

            const resultDate = DateTime.fromISO(result, { zone: 'utc' })
            const now = DateTime.now().toUTC()
            expect(resultDate > now).toBe(true)

            // Should be June 1st of some year
            expect(resultDate.month).toBe(6)
            expect(resultDate.day).toBe(1)
        })

        it('should calculate next renewal for weekly subscription', () => {
            const startDate = '2024-11-01' // A Friday
            const result = calculateNextRenewalDate(startDate, 'weekly')

            const resultDate = DateTime.fromISO(result, { zone: 'utc' })
            const startDT = DateTime.fromISO(startDate, { zone: 'utc' })
            const now = DateTime.now().toUTC()

            expect(resultDate > now).toBe(true)

            // Should be on the same day of the week
            expect(resultDate.weekday).toBe(startDT.weekday)
        })

        it('should handle edge case of renewal date today', () => {
            const today = DateTime.now().toUTC().toISODate()
            if (!today) return

            const result = calculateNextRenewalDate(today, 'monthly')
            const resultDate = DateTime.fromISO(result, { zone: 'utc' })
            const now = DateTime.now().toUTC()

            // Should be next month, not today
            expect(resultDate > now).toBe(true)
        })
    })

    describe('daysUntilRenewal', () => {
        it('should calculate positive days for future date', () => {
            const futureDate = DateTime.now().toUTC().plus({ days: 7 }).toISODate()
            if (!futureDate) return

            const days = daysUntilRenewal(futureDate)
            expect(days).toBeGreaterThanOrEqual(6)
            expect(days).toBeLessThanOrEqual(8)
        })

        it('should calculate negative days for past date', () => {
            const pastDate = DateTime.now().toUTC().minus({ days: 3 }).toISODate()
            if (!pastDate) return

            const days = daysUntilRenewal(pastDate)
            expect(days).toBeLessThan(0)
        })
    })

    describe('convertToMonthlySpend', () => {
        it('should convert weekly spend correctly', () => {
            const weeklyAmount = 10
            const monthly = convertToMonthlySpend(weeklyAmount, 'weekly')
            expect(monthly).toBeCloseTo(43.3, 1)
        })

        it('should return same for monthly', () => {
            const monthlyAmount = 50
            const result = convertToMonthlySpend(monthlyAmount, 'monthly')
            expect(result).toBe(50)
        })

        it('should convert yearly spend correctly', () => {
            const yearlyAmount = 120
            const monthly = convertToMonthlySpend(yearlyAmount, 'yearly')
            expect(monthly).toBe(10)
        })
    })

    describe('convertToYearlySpend', () => {
        it('should convert monthly to yearly correctly', () => {
            const monthly = 10
            const yearly = convertToYearlySpend(monthly)
            expect(yearly).toBe(120)
        })

        it('should handle fractional amounts', () => {
            const monthly = 9.99
            const yearly = convertToYearlySpend(monthly)
            expect(yearly).toBeCloseTo(119.88, 2)
        })
    })
})
