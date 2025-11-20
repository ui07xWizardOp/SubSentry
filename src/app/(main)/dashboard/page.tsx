import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { convertCurrency, type CurrencyCode } from '@/lib/currency/converter'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatsGrid } from '@/components/dashboard/StatsGrid'
import { FloatingActionButton } from '@/components/dashboard/FloatingActionButton'
import { SubscriptionList } from '@/components/dashboard/SubscriptionList'
import {
    Download,
    Plus,
    CreditCard,
} from 'lucide-react'

async function getDashboardData(): Promise<{
    totalMonthlySpend: number
    totalYearlySpend: number
    activeSubscriptions: number
    upcomingRenewals: any[]
    subscriptions: any[]
    budgetLimit: number
    currency: CurrencyCode
} | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)

    if (!subscriptions) return { totalMonthlySpend: 0, totalYearlySpend: 0, activeSubscriptions: 0, upcomingRenewals: [], subscriptions: [], budgetLimit: 100, currency: 'USD' }

    const { data: preferences } = await supabase
        .from('user_preferences')
        .select('monthly_budget, currency')
        .eq('user_id', user.id)
        .single()

    const userCurrency = (preferences?.currency || 'USD') as CurrencyCode
    const budgetLimit = preferences?.monthly_budget || 100

    let totalMonthlySpend = 0
    let totalYearlySpend = 0
    let activeSubscriptions = 0

    // Process subscriptions in parallel for currency conversion
    await Promise.all(subscriptions.map(async (sub) => {
        if (sub.status !== 'active') return
        activeSubscriptions++

        // Convert amount to user's currency
        const amountInUserCurrency = await convertCurrency(
            Number(sub.amount),
            (sub.currency || 'USD') as CurrencyCode,
            userCurrency
        )

        if (sub.billing_cycle === 'monthly') {
            totalMonthlySpend += amountInUserCurrency
            totalYearlySpend += amountInUserCurrency * 12
        } else if (sub.billing_cycle === 'yearly') {
            totalMonthlySpend += amountInUserCurrency / 12
            totalYearlySpend += amountInUserCurrency
        } else if (sub.billing_cycle === 'weekly') {
            totalMonthlySpend += amountInUserCurrency * 4.33
            totalYearlySpend += amountInUserCurrency * 52
        }
    }))

    const now = new Date()
    const processedSubscriptions = subscriptions.map(sub => {
        const renewalDate = new Date(sub.next_renewal_date)
        const diffTime = renewalDate.getTime() - now.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return { ...sub, daysUntilRenewal: diffDays }
    })

    const upcomingRenewals = processedSubscriptions
        .filter(sub => sub.status === 'active' && sub.daysUntilRenewal >= 0 && sub.daysUntilRenewal <= 30)
        .sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal)

    return {
        totalMonthlySpend: Math.round(totalMonthlySpend * 100) / 100,
        totalYearlySpend: Math.round(totalYearlySpend * 100) / 100,
        activeSubscriptions,
        upcomingRenewals,
        subscriptions: processedSubscriptions,
        budgetLimit,
        currency: userCurrency
    }
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const stats = await getDashboardData()
    const hasSubscriptions = stats && stats.subscriptions && stats.subscriptions.length > 0

    return (
        <>
            <main className="container max-w-7xl mx-auto space-y-8">
                {/* Stats Grid */}
                <StatsGrid
                    totalMonthlySpend={stats?.totalMonthlySpend || 0}
                    totalYearlySpend={stats?.totalYearlySpend || 0}
                    activeSubscriptions={stats?.activeSubscriptions || 0}
                    upcomingRenewals={stats?.upcomingRenewals.length || 0}
                    currency={stats?.currency as CurrencyCode | undefined}
                />

                {/* Section Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Dashboard</h2>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>

                {/* Upcoming Renewals Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Upcoming Renewals</h2>
                        <Button variant="ghost" asChild className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                            <Link href="/subscriptions">View all subscriptions</Link>
                        </Button>
                    </div>

                    {stats?.upcomingRenewals && stats.upcomingRenewals.length > 0 ? (
                        <SubscriptionList
                            initialSubscriptions={stats.upcomingRenewals.slice(0, 5)}
                            viewMode="compact"
                        />
                    ) : hasSubscriptions ? (
                        <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mb-3">
                                    <CreditCard className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-medium mb-1 text-slate-900 dark:text-white">
                                    No upcoming renewals
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">
                                    You&apos;re all caught up for the next 30 days.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center mb-4">
                                    <CreditCard className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-display font-semibold mb-2 text-slate-900 dark:text-white">
                                    No subscriptions yet
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm">
                                    Add your first subscription to start tracking your monthly spending and get renewal reminders
                                </p>
                                <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                                    <Link href="/subscriptions/new">
                                        <Plus className="mr-2 h-5 w-5" />
                                        Add your first subscription
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>

            {/* Floating Action Button */}
            <FloatingActionButton href="/subscriptions/new" />
        </>
    )
}
