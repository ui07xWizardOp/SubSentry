import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, CreditCard, Calendar, TrendingUp } from 'lucide-react'

interface DashboardStatsProps {
    stats: {
        totalMonthlySpend: number
        totalYearlySpend: number
        activeSubscriptions: number
        upcomingRenewals: any[]
    }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/20 dark:to-background dark:border-violet-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-violet-900 dark:text-violet-100">
                        Monthly Spend
                    </CardTitle>
                    <DollarSign className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-violet-900 dark:text-violet-100">
                        ${stats.totalMonthlySpend.toFixed(2)}
                    </div>
                    <p className="text-xs text-violet-600 dark:text-violet-400 mt-1">
                        ${stats.totalYearlySpend.toFixed(2)} / year
                    </p>
                </CardContent>
            </Card>

            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background dark:border-blue-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Yearly Projection
                    </CardTitle>
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                        ${stats.totalYearlySpend.toFixed(2)}
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Total annual cost
                    </p>
                </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background dark:border-emerald-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                        Active Subscriptions
                    </CardTitle>
                    <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                        {stats.activeSubscriptions}
                    </div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                        Currently tracked
                    </p>
                </CardContent>
            </Card>

            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-background dark:border-amber-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-amber-900 dark:text-amber-100">
                        Upcoming Renewals
                    </CardTitle>
                    <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                        {stats.upcomingRenewals.length}
                    </div>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                        in the next 30 days
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
