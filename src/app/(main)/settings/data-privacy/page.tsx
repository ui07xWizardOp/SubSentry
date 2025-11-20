"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Download, Trash2, FileText, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"

export default function DataPrivacyPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [exporting, setExporting] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const handleExportData = async () => {
        setExporting(true)
        try {
            // In a real app, this would call an API endpoint to generate a CSV/JSON export
            // For now, we'll simulate a delay and show a success message
            await new Promise(resolve => setTimeout(resolve, 2000))

            toast({
                title: "Data Export Started",
                description: "Your data is being prepared. You will receive an email with the download link shortly.",
            })
        } catch (error) {
            toast({
                title: "Export Failed",
                description: "Failed to start data export. Please try again.",
                variant: "destructive",
            })
        } finally {
            setExporting(false)
        }
    }

    const handleDeleteAccount = async () => {
        setDeleting(true)
        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            )

            // In a real app, you would call a server action or API to delete all user data
            // For now, we'll just sign out
            await supabase.auth.signOut()

            toast({
                title: "Account Deleted",
                description: "Your account has been scheduled for deletion.",
            })

            router.push('/login')
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete account. Please contact support.",
                variant: "destructive",
            })
            setDeleting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Data & Privacy</h3>
                <p className="text-sm text-slate-500">
                    Manage your data, export your information, and control your privacy settings.
                </p>
            </div>

            {/* Data Export */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Download className="h-5 w-5 text-indigo-600" />
                        Export Data
                    </CardTitle>
                    <CardDescription>
                        Download a copy of all your subscription data and preferences.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        onClick={handleExportData}
                        disabled={exporting}
                        variant="outline"
                    >
                        {exporting ? "Preparing Export..." : "Export All Data (CSV)"}
                    </Button>
                </CardContent>
            </Card>

            {/* Privacy Policy & Terms */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-indigo-600" />
                        Legal & Privacy
                    </CardTitle>
                    <CardDescription>
                        Review our policies regarding your data and privacy.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-slate-500" />
                            <div>
                                <p className="font-medium">Privacy Policy</p>
                                <p className="text-xs text-slate-500">Last updated: November 2025</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                            <a href="#" target="_blank" rel="noopener noreferrer">View</a>
                        </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-slate-500" />
                            <div>
                                <p className="font-medium">Terms of Service</p>
                                <p className="text-xs text-slate-500">Last updated: November 2025</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                            <a href="#" target="_blank" rel="noopener noreferrer">View</a>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200 dark:border-red-900/50">
                <CardHeader>
                    <CardTitle className="text-red-600 dark:text-red-500 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>
                        Irreversible actions related to your account and data.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100">Delete Account</p>
                            <p className="text-sm text-slate-500">
                                Permanently delete your account and all associated data.
                            </p>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" disabled={deleting}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Account
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        account and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteAccount}
                                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                    >
                                        {deleting ? "Deleting..." : "Yes, delete my account"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
