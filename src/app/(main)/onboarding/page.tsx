import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { OnboardingClient } from './OnboardingClient'
import { detectUserCurrency } from '@/lib/currency/server'

export const dynamic = 'force-dynamic'

export default async function OnboardingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Detect user's currency on the server side
    const detectedCurrency = await detectUserCurrency()

    return <OnboardingClient initialCurrency={detectedCurrency} />
}
