'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const isDark = theme === 'dark'

    return (
        <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                    {isDark ? (
                        <Moon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                    ) : (
                        <Sun className="h-5 w-5 text-amber-600" />
                    )}
                </div>
                <div>
                    <Label htmlFor="theme-toggle" className="text-sm font-medium cursor-pointer">
                        Dark Mode
                    </Label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {isDark ? 'Dark theme is active' : 'Light theme is active'}
                    </p>
                </div>
            </div>
            <Switch
                id="theme-toggle"
                checked={isDark}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                className="data-[state=checked]:bg-indigo-600"
            />
        </div>
    )
}
