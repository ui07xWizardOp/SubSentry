"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, getCurrencySymbol } from "@/lib/currency/converter"

interface BudgetCardProps {
    monthlySpend: number
    budgetLimit?: number
    currency?: string
}

export function BudgetCard({ monthlySpend, budgetLimit = 100, currency = 'USD' }: BudgetCardProps) {
    const percentage = (monthlySpend / budgetLimit) * 100
    const isOverBudget = monthlySpend > budgetLimit
    const isNearBudget = percentage >= 90 && !isOverBudget

    return (
        <Card className={`${isOverBudget ? 'border-red-500 dark:border-red-900' : isNearBudget ? 'border-amber-500 dark:border-amber-900' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
                {isOverBudget ? (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                ) : (
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                )}
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="space-y-1">
                    <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold">{formatCurrency(monthlySpend, currency)}</span>
                        <span className="text-sm text-muted-foreground">of {formatCurrency(budgetLimit, currency)}</span>
                    </div>
                    <Progress
                        value={Math.min(percentage, 100)}
                        className={`h-2 ${isOverBudget ? 'bg-red-100 dark:bg-red-950' : isNearBudget ? 'bg-amber-100 dark:bg-amber-950' : ''}`}
                    />
                </div>

                {isOverBudget && (
                    <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Over budget by {formatCurrency(monthlySpend - budgetLimit, currency)}
                    </Badge>
                )}

                {isNearBudget && (
                    <Badge variant="outline" className="text-xs border-amber-500 text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Nearing budget limit ({percentage.toFixed(0)}%)
                    </Badge>
                )}

                {!isOverBudget && !isNearBudget && (
                    <p className="text-xs text-muted-foreground">
                        {formatCurrency(budgetLimit - monthlySpend, currency)} remaining ({(100 - percentage).toFixed(0)}% left)
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
