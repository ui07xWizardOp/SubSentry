'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth/server'

export async function deleteSubscription(id: string) {
    const { supabase, user } = await requireAuth()

    const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        throw new Error('Failed to delete subscription')
    }

    revalidatePath('/dashboard')
}

export async function pauseSubscription(id: string) {
    const { supabase, user } = await requireAuth()

    const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'paused' })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        throw new Error('Failed to pause subscription')
    }

    revalidatePath('/dashboard')
}

export async function resumeSubscription(id: string) {
    const { supabase, user } = await requireAuth()

    const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'active' })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        throw new Error('Failed to resume subscription')
    }

    revalidatePath('/dashboard')
}
