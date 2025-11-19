"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon, ArrowLeft, Loader2 } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { useToast } from '@/hooks/use-toast'

const subscriptionSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Amount must be a positive number',
    }),
    currency: z.string().default('USD'),
    billing_cycle: z.enum(['weekly', 'monthly', 'yearly']),
    start_date: z.date(),
    next_renewal_date: z.date(),
    category: z.string().optional(),
    notes: z.string().max(500).optional(),
    payment_method: z.string().optional(),
})

type SubscriptionFormData = z.infer<typeof subscriptionSchema>

const POPULAR_SERVICES = [
    { name: 'Netflix', category: 'Streaming' },
    { name: 'Spotify', category: 'Music' },
    { name: 'Disney+', category: 'Streaming' },
    { name: 'Amazon Prime', category: 'Streaming' },
    { name: 'YouTube Premium', category: 'Streaming' },
    { name: 'Apple Music', category: 'Music' },
    { name: 'Adobe Creative Cloud', category: 'Productivity' },
    { name: 'GitHub Pro', category: 'Productivity' },
    { name: 'Microsoft 365', category: 'Productivity' },
    { name: 'Dropbox', category: 'Cloud Storage' },
    { name: 'Google One', category: 'Cloud Storage' },
    { name: 'iCloud+', category: 'Cloud Storage' },
]

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

export default function NewSubscriptionPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [showServiceSuggestions, setShowServiceSuggestions] = useState(false)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<SubscriptionFormData>({
        resolver: zodResolver(subscriptionSchema),
        defaultValues: {
            currency: 'USD',
            billing_cycle: 'monthly',
            start_date: new Date(),
            next_renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
    })

    const serviceName = watch('name')
    const startDate = watch('start_date')
    const billingCycle = watch('billing_cycle')

    // Auto-calculate next renewal date when start date or billing cycle changes
    const calculateNextRenewal = (start: Date, cycle: string) => {
        const next = new Date(start)
        switch (cycle) {
            case 'weekly':
                next.setDate(next.getDate() + 7)
                break
            case 'monthly':
                next.setMonth(next.getMonth() + 1)
                break
            case 'yearly':
                next.setFullYear(next.getFullYear() + 1)
                break
        }
        return next
    }

    const onSubmit = async (data: SubscriptionFormData) => {
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                toast({
                    title: 'Error',
                    description: 'You must be logged in to add a subscription',
                    variant: 'destructive',
                })
                return
            }

            const { error } = await supabase.from('subscriptions').insert({
                user_id: user.id,
                name: data.name,
                amount: Number(data.amount),
                currency: data.currency,
                billing_cycle: data.billing_cycle,
                start_date: data.start_date.toISOString(),
                next_renewal_date: data.next_renewal_date.toISOString(),
                category: data.category || 'Other',
                notes: data.notes,
                payment_method: data.payment_method,
                status: 'active',
            })

            if (error) throw error

            toast({
                title: 'Success!',
                description: 'Subscription added successfully',
            })

            router.push('/dashboard')
            router.refresh()
        } catch (error) {
            console.error('Error adding subscription:', error)
            toast({
                title: 'Error',
                description: 'Failed to add subscription. Please try again.',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    const handleServiceSelect = (service: typeof POPULAR_SERVICES[0]) => {
        setValue('name', service.name)
        setValue('category', service.category)
        setShowServiceSuggestions(false)
    }

    const filteredServices = POPULAR_SERVICES.filter((service) =>
        service.name.toLowerCase().includes(serviceName?.toLowerCase() || '')
    )

    return (
        <div className="container max-w-3xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="mb-8">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <h1 className="text-3xl font-bold mb-2">Add New Subscription</h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Track a new recurring expense
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Subscription Details</CardTitle>
                        <CardDescription>
                            Enter the details of your subscription below
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Service Name with Autocomplete */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Service Name *</Label>
                            <div className="relative">
                                <Input
                                    id="name"
                                    placeholder="e.g., Netflix, Spotify"
                                    {...register('name')}
                                    onFocus={() => setShowServiceSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowServiceSuggestions(false), 200)}
                                />
                                {showServiceSuggestions && filteredServices.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-950 border rounded-md shadow-lg max-h-60 overflow-auto">
                                        {filteredServices.map((service) => (
                                            <button
                                                key={service.name}
                                                type="button"
                                                className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-900 flex justify-between items-center"
                                                onClick={() => handleServiceSelect(service)}
                                            >
                                                <span>{service.name}</span>
                                                <span className="text-xs text-slate-500">{service.category}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {errors.name && (
                                <p className="text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Amount and Currency */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount *</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...register('amount')}
                                />
                                {errors.amount && (
                                    <p className="text-sm text-red-600">{errors.amount.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Select
                                    defaultValue="USD"
                                    onValueChange={(value) => setValue('currency', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USD">USD ($)</SelectItem>
                                        <SelectItem value="EUR">EUR (€)</SelectItem>
                                        <SelectItem value="GBP">GBP (£)</SelectItem>
                                        <SelectItem value="INR">INR (₹)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Billing Cycle */}
                        <div className="space-y-2">
                            <Label htmlFor="billing_cycle">Billing Cycle *</Label>
                            <Select
                                defaultValue="monthly"
                                onValueChange={(value: 'weekly' | 'monthly' | 'yearly') => {
                                    setValue('billing_cycle', value)
                                    setValue('next_renewal_date', calculateNextRenewal(startDate, value))
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                'w-full justify-start text-left font-normal',
                                                !startDate && 'text-muted-foreground'
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={(date) => {
                                                if (date) {
                                                    setValue('start_date', date)
                                                    setValue('next_renewal_date', calculateNextRenewal(date, billingCycle))
                                                }
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label>Next Renewal *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                'w-full justify-start text-left font-normal',
                                                !watch('next_renewal_date') && 'text-muted-foreground'
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {watch('next_renewal_date')
                                                ? format(watch('next_renewal_date'), 'PPP')
                                                : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={watch('next_renewal_date')}
                                            onSelect={(date) => date && setValue('next_renewal_date', date)}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select onValueChange={(value) => setValue('category', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-2">
                            <Label htmlFor="payment_method">Payment Method (Optional)</Label>
                            <Input
                                id="payment_method"
                                placeholder="e.g., Visa ending in 1234"
                                {...register('payment_method')}
                            />
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Textarea
                                id="notes"
                                placeholder="Add any additional notes..."
                                {...register('notes')}
                                rows={3}
                            />
                            {errors.notes && (
                                <p className="text-sm text-red-600">{errors.notes.message}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end gap-4 mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Subscription
                    </Button>
                </div>
            </form>
        </div>
    )
}
