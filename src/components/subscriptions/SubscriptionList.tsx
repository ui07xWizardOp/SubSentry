"use client"

import { useState, useEffect } from 'react'
import { SubscriptionCard } from './SubscriptionCard'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { SubscriptionForm } from './SubscriptionForm'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

interface Subscription {
    id: string
    service_name: string
    amount: number
    billing_cycle: "monthly" | "yearly" | "weekly"
    next_renewal_date: string
    status: string
    reminder_days_before?: number
    category_id?: string
    is_trial?: boolean
    notes?: string
    website_url?: string
}

export function SubscriptionList() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const fetchSubscriptions = async () => {
        try {
            const res = await fetch('/api/subscriptions')
            if (res.ok) {
                const data = await res.json()
                // Normalize data: convert null to undefined for optional fields
                const normalizedData = data.map((sub: Subscription) => ({
                    ...sub,
                    category_id: sub.category_id ?? undefined,
                    notes: sub.notes ?? undefined,
                    website_url: sub.website_url ?? undefined,
                }))
                setSubscriptions(normalizedData)
            }
        } catch {
            console.error('Failed to fetch subscriptions')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSubscriptions()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this subscription?')) return

        try {
            const res = await fetch(`/api/subscriptions/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setSubscriptions(prev => prev.filter(sub => sub.id !== id))
            }
        } catch {
            console.error('Failed to delete')
        }
    }

    const handleEdit = (id: string) => {
        setEditingId(id)
        setIsAddOpen(true)
    }

    const handleSuccess = () => {
        setIsAddOpen(false)
        setEditingId(null)
        fetchSubscriptions()
    }

    if (loading) return <div>Loading...</div>

    const editingSubscription = subscriptions.find(sub => sub.id === editingId)

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Your Subscriptions</h2>
                <Dialog open={isAddOpen} onOpenChange={(open) => {
                    setIsAddOpen(open)
                    if (!open) setEditingId(null)
                }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Subscription
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <SubscriptionForm
                            initialData={editingSubscription ? {
                                ...editingSubscription,
                                start_date: editingSubscription.next_renewal_date,
                                reminder_days_before: editingSubscription.reminder_days_before || 3,
                                is_trial: editingSubscription.is_trial || false,
                                category_id: editingSubscription.category_id || undefined,
                                notes: editingSubscription.notes || undefined,
                                website_url: editingSubscription.website_url || undefined,
                            } : undefined}
                            onSuccess={handleSuccess}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {subscriptions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                    No subscriptions yet. Add one to get started!
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {subscriptions.map(sub => (
                        <SubscriptionCard
                            key={sub.id}
                            subscription={sub}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
