"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { updateBudget, getBudget } from "./actions"
import { updateCurrency, getCurrency } from "./currency-actions"
import { CurrencySelector } from "@/components/currency/CurrencySelector"
import { ThemeToggle } from "@/components/settings/ThemeToggle"
import { useToast } from "@/hooks/use-toast"
import type { CurrencyCode } from "@/lib/currency/converter"

export default function PreferencesPage() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [budget, setBudget] = useState<string>("")
    const [currency, setCurrency] = useState<CurrencyCode>("USD")

    useEffect(() => {
        async function loadPreferences() {
            try {
                const [savedBudget, savedCurrency] = await Promise.all([
                    getBudget(),
                    getCurrency()
                ])
                setBudget(savedBudget ? savedBudget.toString() : "")
                setCurrency(savedCurrency)
            } catch (error) {
                console.error('Error loading preferences:', error)
            } finally {
                setFetching(false)
            }
        }
        loadPreferences()
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const budgetValue = parseFloat(budget)
        if (isNaN(budgetValue) || budgetValue < 0) {
            toast({
                title: "Invalid Budget",
                description: "Please enter a valid positive number.",
                variant: "destructive",
            })
            setLoading(false)
            return
        }

        try {
            await Promise.all([
                updateBudget(budgetValue),
                updateCurrency(currency)
            ])
            toast({
                title: "Preferences Saved",
                description: "Your preferences have been updated.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save preferences.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Preferences</h3>
                <p className="text-sm text-slate-500">
                    Customize your SubSentry experience.
                </p>
            </div>

            {/* Appearance Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                        Customize how SubSentry looks on your device.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ThemeToggle />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Regional Settings</CardTitle>
                    <CardDescription>
                        Set your preferred currency for displaying subscription costs.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="currency">Preferred Currency</Label>
                            <CurrencySelector
                                value={currency}
                                onValueChange={(value) => setCurrency(value as CurrencyCode)}
                            />
                            <p className="text-xs text-slate-500">
                                Your dashboard will show totals converted to this currency.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="budget">Monthly Budget Limit</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="budget"
                                    type="number"
                                    placeholder="e.g. 100"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    min="0"
                                    step="0.01"
                                    className="flex-1"
                                />
                                <div className="w-20 flex items-center justify-center border rounded-md bg-slate-50 dark:bg-slate-900 text-sm text-slate-600 dark:text-slate-400">
                                    {currency}
                                </div>
                            </div>
                            <p className="text-xs text-slate-500">
                                We'll alert you if your monthly subscriptions exceed this amount.
                            </p>
                        </div>

                        <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Preferences
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
