"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, isSameDay, parseISO } from "date-fns"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Subscription = {
    id: string
    name: string
    amount: number
    currency: string
    next_renewal_date: string
    category?: string
}

interface CalendarViewProps {
    subscriptions: Subscription[]
}

export function CalendarView({ subscriptions }: CalendarViewProps) {
    const [date, setDate] = useState<Date | undefined>(new Date())

    // Create a map of dates to subscriptions for easy lookup
    const subscriptionsByDate = subscriptions.reduce((acc, sub) => {
        const dateStr = sub.next_renewal_date.split('T')[0] // Simple date string YYYY-MM-DD
        if (!acc[dateStr]) {
            acc[dateStr] = []
        }
        acc[dateStr].push(sub)
        return acc
    }, {} as Record<string, Subscription[]>)

    // Get subscriptions for the selected date
    const selectedDateSubscriptions = date
        ? subscriptions.filter(sub => isSameDay(parseISO(sub.next_renewal_date), date))
        : []

    // Function to determine if a day has subscriptions (for modifiers)
    const hasSubscriptions = (day: Date) => {
        const dateStr = format(day, 'yyyy-MM-dd')
        return !!subscriptionsByDate[dateStr]
    }

    return (
        <div className="grid md:grid-cols-[1fr_300px] gap-6">
            <Card className="h-full min-h-[400px] flex items-center justify-center">
                <CardContent className="p-4 flex justify-center w-full">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border shadow-sm p-4 w-fit"
                        fixedWeeks
                        showOutsideDays={true}
                        modifiers={{
                            hasSubs: (date) => hasSubscriptions(date)
                        }}
                        modifiersClassNames={{
                            hasSubs: "font-bold text-indigo-600 dark:text-indigo-400 relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-indigo-600 dark:after:bg-indigo-400 after:rounded-full"
                        }}
                    />
                </CardContent>
            </Card>

            <Card className="h-[500px] flex flex-col">
                <CardHeader>
                    <CardTitle>
                        {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                    <ScrollArea className="h-full px-6 pb-6">
                        {selectedDateSubscriptions.length > 0 ? (
                            <div className="space-y-4">
                                {selectedDateSubscriptions.map(sub => (
                                    <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="text-xs">{sub.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-sm">{sub.name}</p>
                                                <p className="text-xs text-slate-500">{sub.category || 'Subscription'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-sm">${sub.amount}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-4 border-t mt-4">
                                    <div className="flex justify-between items-center font-medium">
                                        <span>Total for day</span>
                                        <span>
                                            ${selectedDateSubscriptions.reduce((sum, sub) => sum + sub.amount, 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-4">
                                <p>No subscriptions renewing on this date.</p>
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
