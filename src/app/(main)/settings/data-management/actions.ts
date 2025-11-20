'use server'

import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth/server'

export async function exportData() {
    const { supabase, user } = await requireAuth()

    // Fetch all user data
    const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)

    // Construct the export object
    const exportData = {
        user: {
            id: user.id,
            email: user.email,
            created_at: user.created_at,
        },
        subscriptions: subscriptions || [],
        exportDate: new Date().toISOString(),
    }

    return JSON.stringify(exportData, null, 2)
}

export async function deleteAccount() {
    const { supabase, user } = await requireAuth()

    // Delete all subscriptions
    const { error: subError } = await supabase
        .from('subscriptions')
        .delete()
        .eq('user_id', user.id)

    if (subError) {
        console.error('Error deleting subscriptions:', subError)
        throw new Error('Failed to delete data')
    }

    // Delete user from auth (requires admin privileges usually, but we can try signOut and maybe a soft delete if we had a profile table)
    // Since we can't easily delete from auth.users without admin client, we will just sign them out and maybe mark a flag if we had one.
    // For now, we'll just sign out.

    await supabase.auth.signOut()
    redirect('/')
}
