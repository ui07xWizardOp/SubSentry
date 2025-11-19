import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: subscriptions, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Convert to CSV
        const headers = ['Service Name', 'Amount', 'Billing Cycle', 'Start Date', 'Next Renewal', 'Status', 'Notes']
        const rows = subscriptions.map(sub => [
            sub.service_name,
            sub.amount,
            sub.billing_cycle,
            sub.start_date,
            sub.next_renewal_date,
            sub.status,
            sub.notes || ''
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n')

        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="subsentry-export-${new Date().toISOString().split('T')[0]}.csv"`,
            },
        })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
