"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { subscriptionSchema, type SubscriptionFormData } from '@/lib/validations/subscription'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

interface SubscriptionFormProps {
    initialData?: SubscriptionFormData & { id?: string }
    onSuccess?: () => void
}

export function SubscriptionForm({ initialData, onSuccess }: SubscriptionFormProps) {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SubscriptionFormData>({
        resolver: zodResolver(subscriptionSchema) as any,
        defaultValues: initialData || {
            service_name: '',
            amount: 0,
            billing_cycle: 'monthly',
            start_date: new Date().toISOString().split('T')[0],
            reminder_days_before: 3,
        },
    })

    const onSubmit = async (data: SubscriptionFormData) => {
        setLoading(true)
        setError(null)

        try {
            const url = initialData?.id
                ? `/api/subscriptions/${initialData.id}`
                : '/api/subscriptions'

            const method = initialData?.id ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const json = await res.json()
                throw new Error(json.error || 'Failed to save subscription')
            }

            const savedSubscription = await res.json()

            // Track analytics
            if (typeof window !== 'undefined') {
                const { analytics } = await import('@/lib/posthog/events')
                if (initialData?.id) {
                    analytics.trackSubscriptionUpdated(savedSubscription.id, savedSubscription.service_name)
                } else {
                    analytics.trackSubscriptionCreated(
                        savedSubscription.id,
                        savedSubscription.service_name,
                        savedSubscription.amount,
                        savedSubscription.billing_cycle
                    )
                }
            }

            router.refresh()
            if (onSuccess) onSuccess()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{initialData?.id ? 'Edit Subscription' : 'Add Subscription'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <div className="space-y-2">
                        <Label htmlFor="service_name">Service Name</Label>
                        <Input id="service_name" {...register('service_name')} placeholder="Netflix" />
                        {errors.service_name && <p className="text-red-500 text-xs">{errors.service_name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            {...register('amount', { valueAsNumber: true })}
                            placeholder="15.99"
                        />
                        {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="billing_cycle">Billing Cycle</Label>
                        <select
                            id="billing_cycle"
                            {...register('billing_cycle')}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                            <option value="weekly">Weekly</option>
                        </select>
                        {errors.billing_cycle && <p className="text-red-500 text-xs">{errors.billing_cycle.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="start_date">Start Date</Label>
                        <Input id="start_date" type="date" {...register('start_date')} />
                        {errors.start_date && <p className="text-red-500 text-xs">{errors.start_date.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reminder_days_before">Reminder Days Before</Label>
                        <Input
                            id="reminder_days_before"
                            type="number"
                            {...register('reminder_days_before', { valueAsNumber: true })}
                        />
                        {errors.reminder_days_before && <p className="text-red-500 text-xs">{errors.reminder_days_before.message}</p>}
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Subscription'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
