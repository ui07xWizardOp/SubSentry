'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth/server'

export async function updateBudget(budget: number) {
    const { supabase, user } = await requireAuth()

    // Upsert budget into user_preferences
    const { error } = await supabase
        .from('user_preferences')
        .upsert({
            user_id: user.id,
            monthly_budget: budget,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'user_id'
        })

    if (error) {
        console.error('Error updating budget:', error)
        throw new Error('Failed to update budget')
    }

    revalidatePath('/dashboard')
    revalidatePath('/settings/preferences')
    return { success: true }
}

export async function getBudget() {
    const { supabase, user } = await requireAuth()

    const { data, error } = await supabase
        .from('user_preferences')
        .select('monthly_budget')
        .eq('user_id', user.id)
        .single()

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching budget:', error)
        throw new Error('Failed to fetch budget')
    }

    return data?.monthly_budget || 0
}
