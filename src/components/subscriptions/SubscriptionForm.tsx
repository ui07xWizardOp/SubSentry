"use client"

import { useState } from 'react'
import { useForm, Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { subscriptionSchema, type SubscriptionFormData } from '@/lib/validations/subscription'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

interface SubscriptionFormProps {
    initialData?: SubscriptionFormData & { id?: string }
    onSuccess?: () => void
}

const CATEGORIES = [
    'Streaming',
    'Music',
    'Productivity',
    'Cloud Storage',
    'Software',
    'Gaming',
    'Education',
    'Fitness',
    'Other',
]

export function SubscriptionForm({ initialData, onSuccess }: SubscriptionFormProps) {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [isTrial, setIsTrial] = useState(initialData?.is_trial || false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SubscriptionFormData>({
        resolver: zodResolver(subscriptionSchema) as Resolver<SubscriptionFormData>,
        defaultValues: initialData || {
            service_name: '',
            amount: 0,
            billing_cycle: 'monthly',
            start_date: new Date().toISOString().split('T')[0],
            reminder_days_before: 3,
            is_trial: false,
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

            const payload = {
                ...data,
                is_trial: isTrial,
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
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
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
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
                        <Input id="service_name" {...register('service_name')} placeholder="Netflix, Spotify..." />
                        {errors.service_name && <p className="text-red-500 text-xs">{errors.service_name.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount (per cycle)</Label>
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                                placeholder="3"
                            />
                            {errors.reminder_days_before && <p className="text-red-500 text-xs">{errors.reminder_days_before.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category_id">Category</Label>
                        <select
                            id="category_id"
                            {...register('category_id')}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="">Select a category (optional)</option>
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && <p className="text-red-500 text-xs">{errors.category_id.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="website_url">Website URL (Optional)</Label>
                        <Input
                            id="website_url"
                            type="url"
                            {...register('website_url')}
                            placeholder="https://example.com"
                        />
                        {errors.website_url && <p className="text-red-500 text-xs">{errors.website_url.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            {...register('notes')}
                            placeholder="Add any additional notes..."
                            rows={3}
                        />
                        {errors.notes && <p className="text-red-500 text-xs">{errors.notes.message}</p>}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="is_trial"
                            checked={isTrial}
                            onCheckedChange={(checked) => setIsTrial(checked as boolean)}
                        />
                        <Label htmlFor="is_trial" className="cursor-pointer">
                            This is a free trial
                        </Label>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => onSuccess?.()}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={loading}>
                            {loading ? 'Saving...' : 'Save subscription'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
