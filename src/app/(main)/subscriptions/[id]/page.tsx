"use client"

import { use, useState, useEffect } from 'react'
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon, ArrowLeft, Loader2, Trash2 } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { useToast } from '@/hooks/use-toast'
import { CurrencySelector } from '@/components/currency/CurrencySelector'
import type { CurrencyCode } from '@/lib/currency/converter'

const subscriptionSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Amount must be a positive number',
    }),
    currency: z.string().min(3).max(3),
    billing_cycle: z.enum(['weekly', 'monthly', 'yearly']),
    start_date: z.date(),
    next_renewal_date: z.date(),
    category: z.string().optional(),
    notes: z.string().max(500).optional(),
    payment_method: z.string().optional(),
    status: z.enum(['active', 'paused', 'cancelled']),
})

type SubscriptionFormData = z.infer<typeof subscriptionSchema>

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

export default function EditSubscriptionPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap the params Promise using React.use()
    const { id } = use(params)

    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)

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
    })

    // Load subscription data
    useEffect(() => {
        const loadSubscription = async () => {
            try {
                const { data, error } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error

                if (data) {
                    setValue('name', data.name)
                    setValue('amount', data.amount.toString())
                    setValue('currency', data.currency || 'USD')
                    setValue('billing_cycle', data.billing_cycle)
                    setValue('start_date', new Date(data.start_date))
                    setValue('next_renewal_date', new Date(data.next_renewal_date))
                    setValue('category', data.category)
                    setValue('notes', data.notes || '')
                    setValue('payment_method', data.payment_method || '')
                    setValue('status', data.status)
                }
            } catch (error) {
                console.error('Error loading subscription:', error)
                toast({
                    title: 'Error',
                    description: 'Failed to load subscription',
                    variant: 'destructive',
                })
                router.push('/dashboard')
            } finally {
                setLoadingData(false)
            }
        }

        loadSubscription()
    }, [id, supabase, setValue, toast, router])

    const onSubmit = async (data: SubscriptionFormData) => {
        console.log('onSubmit called!', data) // Debug: Check if function is even called
        setLoading(true)

        try {
            // Use the API route with correct field names matching actual database
            const payload = {
                name: data.name,
                amount: Number(data.amount),
                currency: data.currency, // Form provides this
                billing_cycle: data.billing_cycle,
                start_date: data.start_date.toISOString().split('T')[0],
                next_renewal_date: data.next_renewal_date.toISOString().split('T')[0],
                category: data.category || null,
                status: data.status, // Form provides this
                description: data.notes || null, // Form calls it 'notes', DB calls it 'description'
                website_url: data.payment_method || null, // Form calls it 'payment_method', DB calls it 'website_url'
            }

            console.log('Payload being sent:', payload) // Debug log

            const res = await fetch(`/api/subscriptions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const error = await res.json()
                console.error('API returned error:', error) // Debug: Show API errors
                throw new Error(error.error || 'Failed to update subscription')
            }

            toast({
                title: 'Success!',
                description: 'Subscription updated successfully',
            })

            router.push('/dashboard')
            router.refresh()
        } catch (error) {
            console.error('Error updating subscription:', error)
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to update subscription. Please try again.',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        setDeleting(true)

        try {
            const res = await fetch(`/api/subscriptions/${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || 'Failed to delete subscription')
            }

            toast({
                title: 'Deleted',
                description: 'Subscription deleted successfully',
            })

            router.push('/dashboard')
            router.refresh()
        } catch (error) {
            console.error('Error deleting subscription:', error)
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to delete subscription. Please try again.',
                variant: 'destructive',
            })
            setDeleting(false)
            setDeleteDialogOpen(false)
        }
    }

    if (loadingData) {
        return (
            <div className="container max-w-3xl mx-auto py-20 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        )
    }

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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Edit Subscription</h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Update your subscription details
                        </p>
                    </div>
                    <Button
                        variant="destructive"
                        onClick={() => setDeleteDialogOpen(true)}
                        disabled={loading || deleting}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Subscription Details</CardTitle>
                        <CardDescription>
                            Update the details of your subscription below
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Status */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={watch('status')}
                                onValueChange={(value: 'active' | 'paused' | 'cancelled') =>
                                    setValue('status', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">
                                        <div className="flex items-center">
                                            <Badge className="mr-2 bg-green-500">Active</Badge>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="paused">
                                        <div className="flex items-center">
                                            <Badge className="mr-2 bg-amber-500">Paused</Badge>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                        <div className="flex items-center">
                                            <Badge className="mr-2 bg-red-500">Cancelled</Badge>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Service Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Service Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Netflix, Spotify"
                                {...register('name')}
                            />
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
                                <CurrencySelector
                                    value={(watch('currency') as CurrencyCode) || 'USD'}
                                    onValueChange={(value) => setValue('currency', value as CurrencyCode)}
                                />
                            </div>
                        </div>

                        {/* Billing Cycle */}
                        <div className="space-y-2">
                            <Label htmlFor="billing_cycle">Billing Cycle *</Label>
                            <Select
                                value={watch('billing_cycle')}
                                onValueChange={(value: 'weekly' | 'monthly' | 'yearly') =>
                                    setValue('billing_cycle', value)
                                }
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
                                                !watch('start_date') && 'text-muted-foreground'
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {watch('start_date')
                                                ? format(watch('start_date'), 'PPP')
                                                : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={watch('start_date')}
                                            onSelect={(date) => date && setValue('start_date', date)}
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
                            <Select
                                value={watch('category')}
                                onValueChange={(value) => setValue('category', value)}
                            >
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
                        onClick={() => console.log('Save button clicked!')} // Debug: Check if button responds
                        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </form>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Subscription?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your
                            subscription and all associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Permanently
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
