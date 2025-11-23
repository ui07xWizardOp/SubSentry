"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

const formSchema = z.object({
    name: z.string().min(1),
    amount: z.string().min(1),
    billingCycle: z.enum(["monthly", "yearly"]),
    nextRenewalDate: z.string().min(1),
})

export default function NewSubscriptionPage() {
    const router = useRouter()
    const [form, setForm] = useState({
        name: "",
        amount: "",
        billingCycle: "monthly" as "monthly" | "yearly",
        nextRenewalDate: "",
    })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        const parsed = formSchema.safeParse(form)
        if (!parsed.success) {
            setError("Please fill all required fields correctly.")
            return
        }

        setSubmitting(true)
        try {
            const res = await fetch("/api/subscriptions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    amount: Number(form.amount),
                    billingCycle: form.billingCycle,
                    nextRenewalDate: form.nextRenewalDate,
                }),
            })

            if (!res.ok) {
                const data = await res.json().catch(() => null)
                throw new Error(data?.error ?? "Failed to create subscription")
            }

            // Success: go back to dashboard & refresh data
            router.push("/dashboard")
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.")
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-8">
            <Card className="w-full max-w-lg border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle>Add Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <p className="mb-3 text-sm text-red-500">
                            {error}
                        </p>
                    )}
                    <form className="space-y-4" onSubmit={onSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="name">Service name</Label>
                            <Input
                                id="name"
                                value={form.name}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, name: e.target.value }))
                                }
                                placeholder="Netflix, Spotify…"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount (per cycle)</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                value={form.amount}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, amount: e.target.value }))
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Billing cycle</Label>
                            <Select
                                value={form.billingCycle}
                                onValueChange={(value: "monthly" | "yearly") =>
                                    setForm((f) => ({ ...f, billingCycle: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select cycle" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nextRenewalDate">Next renewal date</Label>
                            <Input
                                id="nextRenewalDate"
                                type="date"
                                value={form.nextRenewalDate}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        nextRenewalDate: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <CardFooter className="px-0 pt-4 flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Saving…" : "Save subscription"}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
