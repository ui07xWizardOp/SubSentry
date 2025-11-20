import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    // Fetch all subscriptions for the user
    const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Generate CSV
    const headers = ['Name', 'Category', 'Amount', 'Currency', 'Billing Cycle', 'Next Renewal', 'Status', 'Start Date']
    const csvRows = [headers.join(',')]

    subscriptions?.forEach(sub => {
        const row = [
            `"${sub.name}"`,
            `"${sub.category || 'Uncategorized'}"`,
            sub.amount,
            sub.currency || 'USD',
            sub.billing_cycle,
            sub.next_renewal_date,
            sub.status,
            sub.start_date || ''
        ]
        csvRows.push(row.join(','))
    })

    const csvContent = csvRows.join('\n')

    return new NextResponse(csvContent, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="subsentry-subscriptions-${new Date().toISOString().split('T')[0]}.csv"`
        }
    })
}
