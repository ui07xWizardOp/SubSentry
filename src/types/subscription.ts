export interface Subscription {
    id: string
    user_id: string
    name: string
    amount: number
    currency: string
    billing_cycle: 'weekly' | 'monthly' | 'yearly'
    start_date: string
    next_renewal_date: string
    category?: string
    status: 'active' | 'paused' | 'cancelled'
    description?: string
    website_url?: string
    created_at?: string
    updated_at?: string
}

export interface UserPreferences {
    user_id: string
    renewal_alerts: boolean
    price_changes: boolean
    marketing_emails: boolean
    monthly_budget?: number
    currency?: string
    updated_at?: string
}

export interface NotificationPreferences {
    renewal_alerts: boolean
    price_changes: boolean
    marketing_emails: boolean
}

export interface DashboardStats {
    totalMonthlySpend: number
    totalYearlySpend: number
    activeSubscriptions: number
    upcomingRenewals: Array<Subscription & { daysUntilRenewal: number }>
    subscriptions: Subscription[]
    budgetLimit?: number
}
