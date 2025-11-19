import { ReactNode } from 'react'
import { SettingsSidebar } from '@/components/layout/SettingsSidebar'

export default function SettingsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="container max-w-7xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Manage your account settings and preferences
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <SettingsSidebar />
                <main className="flex-1">{children}</main>
            </div>
        </div>
    )
}
