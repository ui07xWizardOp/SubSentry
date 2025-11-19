import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { DateTime } from 'luxon'

export async function GET(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: subscriptions, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Calculate stats
        let totalMonthlySpend = 0
        let totalYearlySpend = 0
        let activeSubscriptions = 0

        subscriptions.forEach(sub => {
            if (sub.status !== 'active') return

            activeSubscriptions++
            const amount = Number(sub.amount)

            if (sub.billing_cycle === 'monthly') {
                totalMonthlySpend += amount
                totalYearlySpend += amount * 12
            } else if (sub.billing_cycle === 'yearly') {
                totalMonthlySpend += amount / 12
                totalYearlySpend += amount
            } else if (sub.billing_cycle === 'weekly') {
                totalMonthlySpend += amount * 4.33
                totalYearlySpend += amount * 52
            }
        })

        // Get upcoming renewals (next 30 days)
        const now = DateTime.now()
        const upcomingRenewals = subscriptions
            .filter(sub => sub.status === 'active')
            .map(sub => {
                const renewalDate = DateTime.fromISO(sub.next_renewal_date)
                return {
                    ...sub,
                    daysUntilRenewal: renewalDate.diff(now, 'days').days
                }
            })
            .filter(sub => sub.daysUntilRenewal >= 0 && sub.daysUntilRenewal <= 30)
            .sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal)
            .slice(0, 5)

        return NextResponse.json({
            totalMonthlySpend: Math.round(totalMonthlySpend * 100) / 100,
            totalYearlySpend: Math.round(totalYearlySpend * 100) / 100,
            activeSubscriptions,
            upcomingRenewals
        })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
