import { createClient } from '@/lib/supabase/server'
import { subscriptionSchema } from '@/lib/validations/subscription'
import { NextResponse } from 'next/server'

export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const json = await request.json()
        const result = subscriptionSchema.partial().safeParse(json)

        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation Error', details: result.error.flatten() },
                { status: 400 }
            )
        }

        // Note: We are NOT recalculating next_renewal_date automatically on edit here
        // unless the user explicitly changes start_date or billing_cycle. 
        // For MVP, let's assume the client sends the updated next_renewal_date if needed,
        // or we keep it simple. 
        // Ideally, if start_date changes, we should re-project.
        // Let's leave that logic to the client or a dedicated service for now to keep API simple.

        const { data, error } = await supabase
            .from('subscriptions')
            .update(result.data)
            .eq('id', params.id)
            .eq('user_id', user.id) // RLS handles this, but good to be explicit
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { error } = await supabase
            .from('subscriptions')
            .delete()
            .eq('id', params.id)
            .eq('user_id', user.id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
