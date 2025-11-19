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
                    billing_cycle: 'monthly' | 'yearly' | 'weekly'
                    start_date: string
                    next_renewal_date: string
                    reminder_days_before: number
                    status: 'active' | 'paused'
                    category_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    amount: number
                    billing_cycle: 'monthly' | 'yearly' | 'weekly'
                    start_date: string
                    next_renewal_date: string
                    reminder_days_before?: number
                    status?: 'active' | 'paused'
                    category_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    amount?: number
                    billing_cycle?: 'monthly' | 'yearly' | 'weekly'
                    start_date?: string
                    next_renewal_date?: string
                    reminder_days_before?: number
                    status?: 'active' | 'paused'
                    category_id?: string | null
                    created_at?: string
                }
            }
            categories: {
                Row: {
                    id: string
                    name: string
                    color: string
                    icon: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    color: string
                    icon: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    color?: string
                    icon?: string
                    created_at?: string
                }
            }
        }
    }
}
