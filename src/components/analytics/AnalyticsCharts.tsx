"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

type Subscription = {
    id: string
    name: string
    amount: number
    category?: string
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

interface AnalyticsChartsProps {
    subscriptions: Subscription[]
}

export function AnalyticsCharts({ subscriptions }: AnalyticsChartsProps) {
    const [timeRange, setTimeRange] = useState('monthly')

    // Process data for pie chart (category breakdown)
    const categoryTotals = subscriptions.reduce((acc, sub) => {
        const category = sub.category || 'Uncategorized'
        acc[category] = (acc[category] || 0) + sub.amount
        return acc
    }, {} as Record<string, number>)

    const pieChartData = Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value
    }))

    // Process data for bar chart (top 5 most expensive)
    const barChartData = [...subscriptions]
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5)
        .map(sub => ({
            name: sub.name,
            amount: sub.amount
        }))

    // Empty state
    if (subscriptions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <Plus className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
                    No analytics yet
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
                    Add subscriptions to see your spending insights and trends
                </p>
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                    <Link href="/subscriptions/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Subscription
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="monthly">Monthly View</SelectItem>
                        <SelectItem value="yearly">Yearly View</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Spending by Category ({timeRange})</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                                        contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top 5 Most Expensive ({timeRange})</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barChartData}>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                                    />
                                    <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
