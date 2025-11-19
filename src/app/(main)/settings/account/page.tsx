"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createBrowserClient } from '@supabase/ssr'
import { Loader2, Mail, Calendar } from 'lucide-react'

export default function AccountSettingsPage() {
    const [loadingData, setLoadingData] = useState(true)
    const [email, setEmail] = useState('')
    const [createdAt, setCreatedAt] = useState('')
    const [subscriptionCount, setSubscriptionCount] = useState(0)
    const [totalSpend, setTotalSpend] = useState(0)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )

    useEffect(() => {
        const loadAccountData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                setEmail(user.email || '')
                setCreatedAt(new Date(user.created_at).toLocaleDateString())

                // Get subscription stats
                const { data: subscriptions } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', user.id)

                if (subscriptions) {
                    setSubscriptionCount(subscriptions.length)
                    const total = subscriptions.reduce((sum, sub) => {
                        const amount = Number(sub.amount)
                        if (sub.billing_cycle === 'monthly') return sum + amount
                        if (sub.billing_cycle === 'yearly') return sum + amount / 12
                        if (sub.billing_cycle === 'weekly') return sum + amount * 4.33
                        return sum
                    }, 0)
                    setTotalSpend(Math.round(total * 100) / 100)
                }
            } catch (error) {
                console.error('Error loading account data:', error)
            } finally {
                setLoadingData(false)
            }
        }

        loadAccountData()
    }, [supabase])

    if (loadingData) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Account Information
                    </CardTitle>
                    <CardDescription>
                        View your account details and statistics
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Email */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</p>
                        <p className="text-lg">{email}</p>
                        <p className="text-xs text-slate-500">
                            This is your account email and cannot be changed
                        </p>
                    </div>

                    {/* Account Created */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Account Created
                        </p>
                        <p className="text-lg">{createdAt}</p>
                    </div>

                    {/* Stats */}
                    <div className="pt-4 border-t">
                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Statistics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
                                <p className="text-sm text-slate-600 dark:text-slate-400">Total Subscriptions</p>
                                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{subscriptionCount}</p>
                            </div>
                            <div className="p-4 bg-violet-50 dark:bg-violet-950/20 rounded-lg">
                                <p className="text-sm text-slate-600 dark:text-slate-400">Monthly Spend</p>
                                <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">${totalSpend.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
