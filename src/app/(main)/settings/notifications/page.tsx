"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { saveNotificationPreferences, getNotificationPreferences } from "./actions"
import { useToast } from "@/hooks/use-toast"

export default function NotificationsPage() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [preferences, setPreferences] = useState({
        renewal_alerts: true,
        price_changes: true,
        marketing_emails: false
    })

    useEffect(() => {
        async function loadPreferences() {
            try {
                const prefs = await getNotificationPreferences()
                setPreferences(prefs)
            } catch (error) {
                console.error('Error loading preferences:', error)
            } finally {
                setFetching(false)
            }
        }
        loadPreferences()
    }, [])

    const handleSave = async () => {
        setLoading(true)
        try {
            await saveNotificationPreferences(preferences)
            toast({
                title: "Preferences Saved",
                description: "Your notification settings have been updated.",
            })
        } catch {
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
                <h3 className="text-lg font-medium">Notifications</h3>
                <p className="text-sm text-slate-500">
                    Configure how you receive alerts and updates.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Email Notifications</CardTitle>
                    <CardDescription>
                        Choose what updates you want to receive via email.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="renewal-alerts" className="flex flex-col space-y-1">
                            <span>Renewal Alerts</span>
                            <span className="font-normal text-xs text-slate-500">
                                Get notified before your subscriptions renew
                            </span>
                        </Label>
                        <Switch
                            id="renewal-alerts"
                            checked={preferences.renewal_alerts}
                            onCheckedChange={(checked) => setPreferences({ ...preferences, renewal_alerts: checked })}
                        />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="price-changes" className="flex flex-col space-y-1">
                            <span>Price Changes</span>
                            <span className="font-normal text-xs text-slate-500">
                                Alerts when we detect a price change
                            </span>
                        </Label>
                        <Switch
                            id="price-changes"
                            checked={preferences.price_changes}
                            onCheckedChange={(checked) => setPreferences({ ...preferences, price_changes: checked })}
                        />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="marketing" className="flex flex-col space-y-1">
                            <span>Marketing Emails</span>
                            <span className="font-normal text-xs text-slate-500">
                                Receive news and special offers
                            </span>
                        </Label>
                        <Switch
                            id="marketing"
                            checked={preferences.marketing_emails}
                            onCheckedChange={(checked) => setPreferences({ ...preferences, marketing_emails: checked })}
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Preferences
                </Button>
            </div>
        </div>
    )
}
