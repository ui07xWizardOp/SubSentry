'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Require authentication for server actions
 * @returns Authenticated supabase client and user
 * @throws Error if user is not authenticated
 */
export async function requireAuth() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        throw new Error('Unauthorized')
    }

    return { supabase, user }
}

/**
 * Get the current authenticated user (optional - doesn't throw)
 * @returns User object or null
 */
export async function getCurrentUser() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
}
