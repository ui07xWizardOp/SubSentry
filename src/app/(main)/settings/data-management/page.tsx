"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Download, Loader2 } from "lucide-react"
import { exportData, deleteAccount } from "./actions"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function DataManagementPage() {
    const { toast } = useToast()
    const [exporting, setExporting] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const handleExport = async () => {
        setExporting(true)
        try {
            const jsonString = await exportData()
            const blob = new Blob([jsonString], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `subsentry-export-${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            toast({
                title: "Export Complete",
                description: "Your data has been downloaded successfully.",
            })
        } catch (error) {
            console.error('Export failed:', error)
            toast({
                title: "Export Failed",
                description: "There was an error exporting your data.",
                variant: "destructive",
            })
        } finally {
            setExporting(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm("Are you absolutely sure? This action cannot be undone.")) {
            return
        }

        setDeleting(true)
        try {
            await deleteAccount()
        } catch (error) {
            console.error('Delete failed:', error)
            toast({
                title: "Delete Failed",
                description: "There was an error deleting your account.",
                variant: "destructive",
            })
            setDeleting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Data Management</h3>
                <p className="text-sm text-slate-500">
                    Control your data and account existence.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Export Data</CardTitle>
                    <CardDescription>
                        Download a copy of your data, including subscriptions and usage history.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" onClick={handleExport} disabled={exporting}>
                        {exporting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Download className="mr-2 h-4 w-4" />
                        )}
                        {exporting ? 'Exporting...' : 'Export All Data'}
                    </Button>
                </CardContent>
            </Card>
            <Card className="border-red-200 dark:border-red-900">
                <CardHeader>
                    <CardTitle className="text-red-600 dark:text-red-400">Delete Account</CardTitle>
                    <CardDescription>
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                        {deleting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <AlertTriangle className="mr-2 h-4 w-4" />
                        )}
                        {deleting ? 'Deleting...' : 'Delete Account'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

