import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Calendar, CreditCard, Bell } from 'lucide-react'
import { formatCurrency, getCurrencySymbol } from '@/lib/currency/converter'
import type { CurrencyCode } from '@/lib/currency/converter'

interface StatsGridProps {
    totalMonthlySpend: number
    totalYearlySpend: number
    activeSubscriptions: number
    upcomingRenewals: number
    currency?: CurrencyCode
}

export function StatsGrid({
    totalMonthlySpend,
    totalYearlySpend,
    activeSubscriptions,
    upcomingRenewals,
    currency = 'USD'
}: StatsGridProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Monthly Spend */}
            <Card className="relative overflow-hidden border-indigo-200 bg-indigo-50 dark:bg-indigo-950/20 dark:border-indigo-800">
                <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-5">
                    <CreditCard size={80} />
                </div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Monthly Spend
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(totalMonthlySpend, currency)}
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold mt-2">
                        <TrendingUp size={14} />
                        <span>+2.5%</span>
                        <span className="text-slate-400 font-normal ml-1">vs last month</span>
                    </div>
                </CardContent>
            </Card>

            {/* Yearly Projection */}
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Yearly Projection
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(totalYearlySpend, currency)}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        Based on active subscriptions
                    </p>
                </CardContent>
            </Card>

            {/* Active Subscriptions */}
            <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Active Subscriptions
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                        {activeSubscriptions}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        Currently tracked
                    </p>
                </CardContent>
            </Card>

            {/* Upcoming Renewals */}
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Upcoming Renewals
                    </CardTitle>
                    <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                        {upcomingRenewals}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        In the next 30 days
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
