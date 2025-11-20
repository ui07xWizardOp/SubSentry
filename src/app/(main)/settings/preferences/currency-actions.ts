'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth/server'
import type { CurrencyCode } from '@/lib/currency/converter'

export async function updateCurrency(currency: CurrencyCode) {
    const { supabase, user } = await requireAuth()

    // Upsert currency into user_preferences
    const { error } = await supabase
        .from('user_preferences')
        .upsert({
            user_id: user.id,
            currency: currency,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'user_id'
        })

    if (error) {
        console.error('Error updating currency:', error)
        throw new Error('Failed to update currency')
    }

    revalidatePath('/dashboard')
    revalidatePath('/settings/preferences')
    return { success: true }
}

export async function getCurrency() {
    const { supabase, user } = await requireAuth()

    const { data, error } = await supabase
        .from('user_preferences')
        .select('currency')
        .eq('user_id', user.id)
        .single()

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching currency:', error)
        throw new Error('Failed to fetch currency')
    }

    return (data?.currency || 'USD') as CurrencyCode
}
