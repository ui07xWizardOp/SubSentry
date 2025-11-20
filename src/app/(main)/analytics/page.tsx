import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts'
import { DollarSign, TrendingUp, CreditCard, PieChart } from 'lucide-react'

export default async function AnalyticsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')

    const subs = subscriptions || []

    // Calculate metrics
    const totalMonthlySpend = subs.reduce((acc, sub) => acc + sub.amount, 0)
    const totalYearlySpend = totalMonthlySpend * 12
    const averageCost = subs.length > 0 ? totalMonthlySpend / subs.length : 0

    // Find most expensive category
    const categorySpend: Record<string, number> = {}
    subs.forEach(sub => {
        const cat = sub.category || 'Uncategorized'
        categorySpend[cat] = (categorySpend[cat] || 0) + sub.amount
    })

    let topCategory = 'None'
    let topCategorySpend = 0
    Object.entries(categorySpend).forEach(([cat, spend]) => {
        if (spend > topCategorySpend) {
            topCategory = cat
            topCategorySpend = spend
        }
    })

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Gain insights into your subscription spending habits.
                </p>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Monthly Spend</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalMonthlySpend.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            +0% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Projected Yearly</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalYearlySpend.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            Based on current active subscriptions
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{subs.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Across {Object.keys(categorySpend).length} categories
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Category</CardTitle>
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{topCategory}</div>
                        <p className="text-xs text-muted-foreground">
                            ${topCategorySpend.toFixed(2)} / month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <AnalyticsCharts subscriptions={subs} />
        </div>
    )
}
