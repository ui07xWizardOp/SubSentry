export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            subscriptions: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    amount: number
                    currency: string
                    billing_cycle: 'monthly' | 'yearly' | 'weekly'
                    start_date: string
                    next_renewal_date: string
                    category: string | null
                    status: string
                    description: string | null
                    website_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    amount: number
                    currency: string
                    billing_cycle: 'monthly' | 'yearly' | 'weekly'
                    start_date: string
                    next_renewal_date: string
                    category?: string | null
                    status?: string
                    description?: string | null
                    website_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    amount?: number
                    currency?: string
                    billing_cycle?: 'monthly' | 'yearly' | 'weekly'
                    start_date?: string
                    next_renewal_date?: string
                    category?: string | null
                    status?: string
                    description?: string | null
                    website_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            user_preferences: {
                Row: {
                    user_id: string
                    renewal_alerts: boolean
                    price_changes: boolean
                    marketing_emails: boolean
                    monthly_budget: number | null
                    currency: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    user_id: string
                    renewal_alerts?: boolean
                    price_changes?: boolean
                    marketing_emails?: boolean
                    monthly_budget?: number | null
                    currency?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    user_id?: string
                    renewal_alerts?: boolean
                    price_changes?: boolean
                    marketing_emails?: boolean
                    monthly_budget?: number | null
                    currency?: string
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}
