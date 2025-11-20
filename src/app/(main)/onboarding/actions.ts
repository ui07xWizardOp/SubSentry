'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth/server'

const POPULAR_SERVICES = [
    { name: 'Netflix', price: 15.99, category: 'Streaming' },
    { name: 'Spotify', price: 9.99, category: 'Music' },
    { name: 'Disney+', price: 7.99, category: 'Streaming' },
    { name: 'Amazon Prime', price: 14.99, category: 'Streaming' },
    { name: 'YouTube Premium', price: 11.99, category: 'Streaming' },
    { name: 'Apple Music', price: 9.99, category: 'Music' },
    { name: 'Adobe Creative Cloud', price: 54.99, category: 'Productivity' },
    { name: 'GitHub Pro', price: 4, category: 'Productivity' },
    { name: 'Microsoft 365', price: 6.99, category: 'Productivity' },
    { name: 'Dropbox', price: 11.99, category: 'Cloud Storage' },
    { name: 'Notion', price: 8, category: 'Productivity' },
    { name: 'Hulu', price: 7.99, category: 'Streaming' },
]

export async function createOnboardingSubscriptions(serviceNames: string[]) {
    const { supabase, user } = await requireAuth()

    if (!serviceNames || serviceNames.length === 0) {
        return
    }

    const subscriptionsToInsert = serviceNames.map(name => {
        const service = POPULAR_SERVICES.find(s => s.name === name)
        if (!service) return null

        const now = new Date()
        const nextMonth = new Date(now)
        nextMonth.setMonth(nextMonth.getMonth() + 1)

        return {
            user_id: user.id,
            name: service.name,
            amount: service.price,
            currency: 'USD',
            billing_cycle: 'monthly',
            start_date: now.toISOString(),
            next_renewal_date: nextMonth.toISOString(),
            category: service.category,
            status: 'active',
        }
    }).filter(Boolean)

    if (subscriptionsToInsert.length > 0) {
        const { error } = await supabase
            .from('subscriptions')
            .insert(subscriptionsToInsert)

        if (error) {
            console.error('Error creating subscriptions:', error)
            throw new Error('Failed to create subscriptions')
        }
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}
