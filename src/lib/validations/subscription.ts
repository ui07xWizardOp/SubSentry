import { z } from 'zod'

export const subscriptionSchema = z.object({
    name: z.string().min(1, 'Service name is required'),
    amount: z.number().min(0, 'Amount must be positive'),
    currency: z.string().min(3).max(3),
    billing_cycle: z.enum(['monthly', 'yearly', 'weekly']),
    start_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
    }),
    next_renewal_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
    }).optional(),
    category: z.string().optional().nullable(),
    status: z.string().optional(),
    description: z.string().optional().nullable(),
    website_url: z.string().url().optional().nullable().or(z.literal('')),
})

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>
