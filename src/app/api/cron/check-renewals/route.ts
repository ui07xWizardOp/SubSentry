import { createClient } from '@/lib/supabase/server'
import { sendEmail, getReminderEmailHtml } from '@/lib/email/service'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    // Verify authorization (e.g., via a secret header for Cron jobs)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const supabase = await createClient()

    // Calculate date 3 days from now
    const today = new Date()
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + 3)
    const targetDateStr = targetDate.toISOString().split('T')[0] // YYYY-MM-DD

    // Fetch subscriptions renewing on that date with user preferences
    const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select(`
            *,
            user:users(email),
            user_preferences:user_preferences(renewal_alerts)
        `)
        .eq('status', 'active')
        .gte('next_renewal_date', `${targetDateStr}T00:00:00`)
        .lte('next_renewal_date', `${targetDateStr}T23:59:59`)

    if (error) {
        console.error('Error fetching subscriptions:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!subscriptions || subscriptions.length === 0) {
        return NextResponse.json({ message: 'No renewals found for target date', targetDateStr })
    }

    const results = []

    for (const sub of subscriptions) {
        const userEmail = sub.user?.email
        const renewalAlertsEnabled = sub.user_preferences?.renewal_alerts ?? true // Default to true

        if (userEmail && renewalAlertsEnabled) {
            try {
                const html = getReminderEmailHtml(sub.name, sub.amount, 3)
                await sendEmail({
                    to: userEmail,
                    subject: `Renewal Alert: ${sub.name} renews in 3 days`,
                    html
                })
                results.push({ id: sub.id, status: 'sent', email: userEmail })
            } catch (err) {
                console.error(`Failed to send email for subscription ${sub.id}`, err)
                results.push({ id: sub.id, status: 'failed', error: err })
            }
        }
    }

    return NextResponse.json({
        message: `Processed ${subscriptions.length} subscriptions`,
        results
    })
}
