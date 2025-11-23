"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Later you can pass real subscriptions via props or fetch
// For now this is just a placeholder structure:
type SubscriptionEvent = {
    id: string
    name: string
    date: string // ISO string: "2025-06-12"
    amount: number
}

const MOCK_EVENTS: SubscriptionEvent[] = [
    { id: "1", name: "Netflix", date: "2025-06-12", amount: 15.99 },
    { id: "2", name: "Spotify", date: "2025-06-12", amount: 9.99 },
    { id: "3", name: "Adobe CC", date: "2025-06-18", amount: 54.99 },
]

export default function CalendarPage() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    const eventsForSelectedDate = React.useMemo(() => {
        if (!date) return []
        const selected = date.toISOString().slice(0, 10) // YYYY-MM-DD
        return MOCK_EVENTS.filter(e => e.date === selected)
    }, [date])

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <main className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                            Renewal Calendar
                        </h1>
                        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                            See your upcoming subscription renewals at a glance.
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                    {/* Calendar Card */}
                    <Card className="border-slate-200 dark:border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-sm md:text-base">
                                Calendar
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-center md:justify-start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    // NOTE: if --spacing() is not available in your setup,
                                    // replace these with fixed rem/px: [--cell-size:2.75rem] md:[--cell-size:3rem]
                                    className="rounded-lg border bg-white dark:bg-slate-950 [--cell-size:2.75rem] md:[--cell-size:3rem]"
                                    buttonVariant="ghost"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Events for Selected Day */}
                    <Card className="border-slate-200 dark:border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-sm md:text-base">
                                {date
                                    ? `Renewals on ${date.toLocaleDateString()}`
                                    : "Select a date"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {eventsForSelectedDate.length === 0 ? (
                                <p className="text-sm text-slate-500">
                                    No renewals scheduled for this day.
                                </p>
                            ) : (
                                <ul className="space-y-3">
                                    {eventsForSelectedDate.map((event) => (
                                        <li
                                            key={event.id}
                                            className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">
                                                    {event.name}
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    Auto-renewal
                                                </span>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                ${event.amount.toFixed(2)}
                                            </Badge>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
