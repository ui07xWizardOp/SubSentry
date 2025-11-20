import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SubscriptionList } from '@/components/dashboard/SubscriptionList'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function SubscriptionsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('next_renewal_date', { ascending: true })

    const now = new Date()
    const processedSubscriptions = (subscriptions || []).map(sub => {
        const renewalDate = new Date(sub.next_renewal_date)
        const diffTime = renewalDate.getTime() - now.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return { ...sub, daysUntilRenewal: diffDays }
    })

    return (
        <div className="container max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Subscriptions</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage your recurring payments</p>
                </div>
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                    <Link href="/subscriptions/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Subscription
                    </Link>
                </Button>
            </div>

            <SubscriptionList initialSubscriptions={processedSubscriptions} viewMode="full" />
        </div>
    )
}
