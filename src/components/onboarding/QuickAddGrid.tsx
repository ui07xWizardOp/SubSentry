"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

const POPULAR_SERVICES = [
    { name: 'Netflix', amount: 15.49, cycle: 'monthly', color: 'bg-red-600' },
    { name: 'Spotify', amount: 10.99, cycle: 'monthly', color: 'bg-green-500' },
    { name: 'Amazon Prime', amount: 14.99, cycle: 'monthly', color: 'bg-blue-500' },
    { name: 'Disney+', amount: 13.99, cycle: 'monthly', color: 'bg-blue-900' },
    { name: 'Hulu', amount: 7.99, cycle: 'monthly', color: 'bg-green-400' },
    { name: 'HBO Max', amount: 15.99, cycle: 'monthly', color: 'bg-purple-600' },
    { name: 'Apple Music', amount: 10.99, cycle: 'monthly', color: 'bg-red-500' },
    { name: 'YouTube Premium', amount: 13.99, cycle: 'monthly', color: 'bg-red-700' },
]

export function QuickAddGrid() {
    const router = useRouter()
    const [selected, setSelected] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    const toggleService = (name: string) => {
        setSelected(prev =>
            prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
        )
    }

    const handleContinue = async () => {
        setLoading(true)
        try {
            const servicesToAdd = POPULAR_SERVICES.filter(s => selected.includes(s.name))

            await Promise.all(servicesToAdd.map(service =>
                fetch('/api/subscriptions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        service_name: service.name,
                        amount: service.amount,
                        billing_cycle: service.cycle,
                        start_date: new Date().toISOString().split('T')[0],
                        reminder_days_before: 3,
                    }),
                })
            ))

            router.push('/dashboard')
        } catch (error) {
            console.error('Failed to add subscriptions', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {POPULAR_SERVICES.map((service) => {
                    const isSelected = selected.includes(service.name)
                    return (
                        <Card
                            key={service.name}
                            className={`cursor-pointer transition-all border-2 ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-200'}`}
                            onClick={() => toggleService(service.name)}
                        >
                            <CardContent className="p-6 flex flex-col items-center justify-center space-y-4 text-center h-full">
                                <div className={`w-12 h-12 rounded-full ${service.color} flex items-center justify-center text-white font-bold text-xl`}>
                                    {service.name[0]}
                                </div>
                                <div>
                                    <div className="font-semibold">{service.name}</div>
                                    <div className="text-xs text-muted-foreground">${service.amount}/mo</div>
                                </div>
                                {isSelected ? (
                                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                                        <Check className="w-4 h-4" />
                                    </div>
                                ) : (
                                    <div className="bg-secondary text-secondary-foreground rounded-full p-1 opacity-50">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="flex justify-end">
                <Button size="lg" onClick={handleContinue} disabled={loading || selected.length === 0}>
                    {loading ? 'Saving...' : `Add ${selected.length} Subscriptions`}
                </Button>
            </div>
        </div>
    )
}
