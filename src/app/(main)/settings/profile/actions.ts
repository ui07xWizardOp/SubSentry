'use server'

import { createClient } from '@/lib/supabase/server'

export async function updatePassword(formData: FormData) {
    const password = formData.get('new-password') as string
    const confirmPassword = formData.get('confirm-password') as string

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match' }
    }

    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters' }
    }

    const supabase = await createClient()

    // Verify user is authenticated before updating password
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase.auth.updateUser({
        password: password
    })

    if (error) {
        console.error('Error updating password:', error)
        return { error: error.message }
    }

    return { success: true }
}
