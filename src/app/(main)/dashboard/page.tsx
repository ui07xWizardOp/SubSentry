import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    TrendingUp,
    Calendar,
    CreditCard,
    Bell,
    Download,
    Plus,
    MoreHorizontal,
    Edit,
    Pause,
    Trash,
} from 'lucide-react'

async function getDashboardData() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)

    if (!subscriptions) return { totalMonthlySpend: 0, totalYearlySpend: 0, activeSubscriptions: 0, upcomingRenewals: [], subscriptions: [] }

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

    const now = new Date()
    const upcomingRenewals = subscriptions
        .filter(sub => sub.status === 'active')
        .map(sub => {
            const renewalDate = new Date(sub.next_renewal_date)
            const diffTime = renewalDate.getTime() - now.getTime()
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            return { ...sub, daysUntilRenewal: diffDays }
        })
        .filter(sub => sub.daysUntilRenewal >= 0 && sub.daysUntilRenewal <= 30)
        .sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal)

    return {
        totalMonthlySpend: Math.round(totalMonthlySpend * 100) / 100,
        totalYearlySpend: Math.round(totalYearlySpend * 100) / 100,
        activeSubscriptions,
        upcomingRenewals,
        subscriptions
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
        <main className="container max-w-7xl mx-auto px-6 py-8">
            {/* Hero Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/20 dark:to-slate-900 dark:border-violet-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Monthly Spend
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-violet-900 dark:text-violet-100">
                            ${stats?.totalMonthlySpend.toFixed(2) || '0.00'}
                        </div>
                        <p className="text-xs text-violet-600 dark:text-violet-400 mt-1">
                            Current monthly total
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900 dark:border-blue-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Yearly Projection
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                            ${stats?.totalYearlySpend.toFixed(2) || '0.00'}
                        </div>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            Based on active subscriptions
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900 dark:border-emerald-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Subscriptions
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                            {stats?.activeSubscriptions || 0}
                        </div>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                            Currently tracked
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900 dark:border-amber-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Upcoming Renewals
                        </CardTitle>
                        <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                            {stats?.upcomingRenewals.length || 0}
                        </div>
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                            in the next 30 days
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Your Subscriptions</h2>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                    <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Subscription
                    </Button>
                </div>
            </div>

            {/* Tabs & Content */}
            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    {hasSubscriptions ? (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    {stats?.subscriptions.map((sub: { id: string; name: string; category?: string; amount: number; billing_cycle: string; next_renewal_date: string }) => {
                                        // Calculate days outside JSX to avoid impure function call during render
                                        const daysUntilRenewal = Math.ceil((new Date(sub.next_renewal_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

                                        return (
                                            <div key={sub.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <Avatar>
                                                        <AvatarFallback>{sub.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold">{sub.name}</h3>
                                                        <p className="text-sm text-slate-500">{sub.category || 'Uncategorized'}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold">${sub.amount}</p>
                                                        <p className="text-xs text-slate-500">{sub.billing_cycle}</p>
                                                    </div>
                                                    <div className="text-right min-w-[100px]">
                                                        <p className="text-sm">{new Date(sub.next_renewal_date).toLocaleDateString()}</p>
                                                        <Badge variant="outline" className="text-xs">
                                                            {daysUntilRenewal} days
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Pause className="mr-2 h-4 w-4" />
                                                            Pause
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600">
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                                    <CreditCard className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    No subscriptions yet
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm">
                                    Add your first subscription to start tracking your monthly spending and get renewal reminders
                                </p>
                                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
                                    <Plus className="mr-2 h-5 w-5" />
                                    Add your first subscription
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </main>
    )
}
