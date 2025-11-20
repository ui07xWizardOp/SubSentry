'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth/server'
import type { NotificationPreferences } from '@/types/subscription'

export async function saveNotificationPreferences(preferences: NotificationPreferences) {
    const { supabase, user } = await requireAuth()

    // Upsert preferences (insert or update if exists)
    const { error } = await supabase
        .from('user_preferences')
        .upsert({
            user_id: user.id,
            renewal_alerts: preferences.renewal_alerts,
            price_changes: preferences.price_changes,
            marketing_emails: preferences.marketing_emails,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'user_id'
        })

    if (error) {
        console.error('Error saving preferences:', error)
        throw new Error('Failed to save preferences')
    }

    revalidatePath('/settings/notifications')
    return { success: true }
}

export async function getNotificationPreferences() {
    const { supabase, user } = await requireAuth()

    const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching preferences:', error)
        throw new Error('Failed to fetch preferences')
    }

    // Return defaults if no preferences exist
    return data || {
        renewal_alerts: true,
        price_changes: true,
        marketing_emails: false
    }
}
