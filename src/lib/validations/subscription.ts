import { z } from 'zod'

export const subscriptionSchema = z.object({
    service_name: z.string().min(1, 'Service name is required'),
    amount: z.number().min(0, 'Amount must be positive'),
    billing_cycle: z.enum(['monthly', 'yearly', 'weekly']),
    start_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
    }),
    reminder_days_before: z.number().min(0).max(30).default(3),
    category_id: z.string().optional().nullable(),
    is_trial: z.boolean().default(false),
    notes: z.string().optional().nullable(),
    website_url: z.string().url().optional().nullable().or(z.literal('')),
})

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>
