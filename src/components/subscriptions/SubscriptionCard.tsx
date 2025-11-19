import { format } from 'date-fns'
import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Subscription {
    id: string
    service_name: string
    amount: number
    billing_cycle: string
    next_renewal_date: string
    status: string
    category_id?: string
}

interface SubscriptionCardProps {
    subscription: Subscription
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

export function SubscriptionCard({ subscription, onEdit, onDelete }: SubscriptionCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {subscription.service_name}
                </CardTitle>
                <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(subscription.id)}>
                        <Edit className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(subscription.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">${subscription.amount}</div>
                <p className="text-xs text-muted-foreground capitalize">
                    {subscription.billing_cycle} • Next: {format(new Date(subscription.next_renewal_date), 'MMM d, yyyy')}
                </p>
            </CardContent>
        </Card>
    )
}
