import { createClient } from '@/lib/supabase/server'
import { subscriptionSchema } from '@/lib/validations/subscription'
import { NextResponse } from 'next/server'
import { DateTime } from 'luxon'

export async function GET(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const sort = searchParams.get('sort') || 'next_renewal_date'
        const order = searchParams.get('order') || 'asc'

        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .order(sort, { ascending: order === 'asc' })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const json = await request.json()
        const result = subscriptionSchema.safeParse(json)

        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation Error', details: result.error.flatten() },
                { status: 400 }
            )
        }

        const { start_date, billing_cycle } = result.data

        // Calculate next_renewal_date based on start_date and billing_cycle
        // This is a simple initial calculation. 
        // In a real app, we might want to adjust this based on "today" vs start_date.
        // For now, let's assume start_date is the anchor.
        // If start_date is in the past, we need to project forward to the next future date.

        let nextRenewal = DateTime.fromISO(start_date)
        const now = DateTime.now()

        // Simple projection: if date is past, add cycle until future
        // This logic might need to be more robust or moved to a shared utility
        while (nextRenewal < now.startOf('day')) {
            if (billing_cycle === 'monthly') nextRenewal = nextRenewal.plus({ months: 1 })
            else if (billing_cycle === 'yearly') nextRenewal = nextRenewal.plus({ years: 1 })
            else if (billing_cycle === 'weekly') nextRenewal = nextRenewal.plus({ weeks: 1 })
        }

        const { data, error } = await supabase
            .from('subscriptions')
            .insert({
                ...result.data,
                user_id: user.id,
                next_renewal_date: nextRenewal.toISODate(),
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
