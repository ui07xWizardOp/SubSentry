"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Edit, Pause, Trash, Play, Search, Filter } from "lucide-react"
import { deleteSubscription, pauseSubscription, resumeSubscription } from "@/app/(main)/dashboard/actions"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Subscription = {
    id: string
    name: string
    category?: string
    amount: number
    billing_cycle: string
    next_renewal_date: string
    status: string
    daysUntilRenewal: number
}

interface SubscriptionListProps {
    initialSubscriptions: Subscription[]
    viewMode?: 'full' | 'compact'
}

export function SubscriptionList({ initialSubscriptions, viewMode = 'full' }: SubscriptionListProps) {
    const { toast } = useToast()
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'pause' | 'resume', id: string } | null>(null)

    // Extract unique categories
    const categories = Array.from(new Set(initialSubscriptions.map(s => s.category || 'Uncategorized')))

    const handleDelete = async (id: string) => {
        setLoadingId(id)
        try {
            await deleteSubscription(id)
            toast({
                title: "Subscription deleted",
                description: "The subscription has been successfully removed.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete subscription.",
                variant: "destructive",
            })
        } finally {
            setLoadingId(null)
        }
    }

    const handlePause = async (id: string) => {
        setLoadingId(id)
        try {
            await pauseSubscription(id)
            toast({
                title: "Subscription paused",
                description: "The subscription has been paused.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to pause subscription.",
                variant: "destructive",
            })
        } finally {
            setLoadingId(null)
        }
    }

    const handleResume = async (id: string) => {
        setLoadingId(id)
        try {
            await resumeSubscription(id)
            toast({
                title: "Subscription resumed",
                description: "The subscription is now active.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to resume subscription.",
                variant: "destructive",
            })
        } finally {
            setLoadingId(null)
        }
    }

    const executeAction = async () => {
        if (!confirmAction) return

        const { type, id } = confirmAction
        if (type === 'delete') await handleDelete(id)
        if (type === 'pause') await handlePause(id)
        if (type === 'resume') await handleResume(id)

        setConfirmAction(null)
    }

    const filteredSubscriptions = initialSubscriptions.filter(sub => {
        // Tab filter
        if (activeTab === "upcoming" && sub.daysUntilRenewal > 7) return false
        if (activeTab === "active" && sub.status !== "active") return false

        // Search filter
        if (searchQuery && !sub.name.toLowerCase().includes(searchQuery.toLowerCase())) return false

        // Category filter
        if (categoryFilter !== "all" && (sub.category || 'Uncategorized') !== categoryFilter) return false

        return true
    })

    return (
        <div className="space-y-4">
            {viewMode === 'full' && (
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <Tabs defaultValue="all" className="w-[400px]" onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="all">All Subscriptions</TabsTrigger>
                            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                            <TabsTrigger value="active">Active</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-[200px]">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[150px]">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        {filteredSubscriptions.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                                No subscriptions found matching your filters.
                            </div>
                        ) : (
                            filteredSubscriptions.map((sub) => (
                                <div key={sub.id} className={`flex items-center justify-between p-4 rounded-lg border ${sub.status === 'paused' ? 'bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 opacity-75' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50'}`}>
                                    <div className="flex items-center gap-4 flex-1">
                                        <Avatar>
                                            <AvatarFallback>{sub.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">{sub.name}</h3>
                                                {sub.status === 'paused' && (
                                                    <Badge variant="secondary" className="text-xs">Paused</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500">{sub.category || 'Uncategorized'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">${sub.amount}</p>
                                            <p className="text-xs text-slate-500">{sub.billing_cycle}</p>
                                        </div>
                                        <div className="text-right min-w-[100px]">
                                            <p className="text-sm">{new Date(sub.next_renewal_date).toLocaleDateString()}</p>
                                            <Badge variant={sub.daysUntilRenewal <= 3 ? "destructive" : "outline"} className="text-xs">
                                                {sub.daysUntilRenewal} days
                                            </Badge>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" disabled={loadingId === sub.id}>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <a href={`/subscriptions/${sub.id}`} className="flex items-center cursor-pointer">
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </a>
                                            </DropdownMenuItem>
                                            {sub.status === 'active' ? (
                                                <DropdownMenuItem onClick={() => setConfirmAction({ type: 'pause', id: sub.id })}>
                                                    <Pause className="mr-2 h-4 w-4" />
                                                    Pause
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem onClick={() => setConfirmAction({ type: 'resume', id: sub.id })}>
                                                    <Play className="mr-2 h-4 w-4" />
                                                    Resume
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600" onClick={() => setConfirmAction({ type: 'delete', id: sub.id })}>
                                                <Trash className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmAction?.type === 'delete' && "This action cannot be undone. This will permanently delete the subscription."}
                            {confirmAction?.type === 'pause' && "This will pause the subscription. You can resume it later."}
                            {confirmAction?.type === 'resume' && "This will resume the subscription tracking."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={executeAction} className={confirmAction?.type === 'delete' ? "bg-red-600 hover:bg-red-700" : ""}>
                            {confirmAction?.type === 'delete' ? "Delete" : "Continue"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
