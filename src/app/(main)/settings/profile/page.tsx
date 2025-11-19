"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, Select Value } from '@/components/ui/select'
import { createBrowserClient } from '@supabase/ssr'
import { useToast } from '@/hooks/use-toast'
import { Loader2, User as UserIcon } from 'lucide-react'

export default function ProfileSettingsPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)

    const [displayName, setDisplayName] = useState('')
    const [timezone, setTimezone] = useState('UTC')
    const [currency, setCurrency] = useState('USD')

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                // Try to load user preferences from profiles table
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (profile) {
                    setDisplayName(profile.display_name || user.email?.split('@')[0] || '')
                    setTimezone(profile.timezone || 'UTC')
                    setCurrency(profile.currency || 'USD')
                } else {
                    setDisplayName(user.email?.split('@')[0] || '')
                }
            } catch (error) {
                console.error('Error loading profile:', error)
            } finally {
                setLoadingData(false)
            }
        }

        loadProfile()
    }, [supabase])

    const handleSave = async () => {
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            // Upsert profile data
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    display_name: displayName,
                    timezone: timezone,
                    currency: currency,
                }, {
                    onConflict: 'id'
                })

            if (error) throw error

            toast({
                title: 'Success',
                description: 'Profile updated successfully',
            })

            router.refresh()
        } catch (error) {
            console.error('Error saving profile:', error)
            toast({
                title: 'Error',
                description: 'Failed to update profile',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    if (loadingData) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserIcon className="h-5 w-5" />
                        Profile Information
                    </CardTitle>
                    <CardDescription>
                        Customize your profile and preferences
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Display Name */}
                    <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                            id="displayName"
                            placeholder="Enter your name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                        <p className="text-xs text-slate-500">
                            This is how you'll appear in the app
                        </p>
                    </div>

                    {/* Timezone */}
                    <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select value={timezone} onValueChange={setTimezone}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="UTC">UTC</SelectItem>
                                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                                <SelectItem value="Europe/London">London (GMT)</SelectItem>
                                <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                                <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                                <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                                <SelectItem value="Australia/Sydney">Sydney (AEDT)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-500">
                            Used for displaying dates and times
                        </p>
                    </div>

                    {/* Currency */}
                    <div className="space-y-2">
                        <Label htmlFor="currency">Preferred Currency</Label>
                        <Select value={currency} onValueChange={setCurrency}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USD">USD ($)</SelectItem>
                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                <SelectItem value="GBP">GBP (£)</SelectItem>
                                <SelectItem value="INR">INR (₹)</SelectItem>
                                <SelectItem value="JPY">JPY (¥)</SelectItem>
                                <SelectItem value="AUD">AUD (A$)</SelectItem>
                                <SelectItem value="CAD">CAD (C$)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-500">
                            Default currency for new subscriptions
                        </p>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
