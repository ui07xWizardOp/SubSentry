'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useTheme } from 'next-themes'
import {
    LayoutDashboard,
    Calendar,
    CreditCard,
    PieChart,
    Settings,
    Shield,
    LogOut,
    Menu,
    Bell,
    Sun,
    Moon,
} from 'lucide-react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

interface NavItem {
    title: string
    href: string
    icon: React.ElementType
}

const navItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Subscriptions',
        href: '/subscriptions',
        icon: CreditCard,
    },
    {
        title: 'Calendar',
        href: '/calendar',
        icon: Calendar,
    },
    {
        title: 'Analytics',
        href: '/analytics',
        icon: PieChart,
    },
    {
        title: 'Settings',
        href: '/settings/profile',
        icon: Settings,
    },
]

interface SidebarProps {
    onLogout: () => void
    className?: string
}

function Sidebar({ onLogout, className }: SidebarProps) {
    const pathname = usePathname()

    return (
        <div className={cn('flex h-full flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800', className)}>
            {/* Logo */}
            <div className="p-6 flex items-center gap-2 border-b border-slate-50 dark:border-slate-800">
                <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                    <Shield size={20} />
                </div>
                <span className="text-xl font-display font-extrabold text-slate-900 dark:text-white">
                    Sub Sentry
                </span>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 p-4">
                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium',
                                    isActive
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                )}
                            >
                                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                                <span>{item.title}</span>
                            </Link>
                        )
                    })}
                </nav>
            </ScrollArea>

            {/* Logout */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors font-medium"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Log Out</span>
                </button>
            </div>
        </div>
    )
}

interface TopbarProps {
    onMenuClick: () => void
}

function Topbar({ onMenuClick }: TopbarProps) {
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    // Extract page name from pathname
    const pageName = React.useMemo(() => {
        const segments = pathname.split('/').filter(Boolean)
        if (segments.length === 0) return 'Dashboard'
        const lastSegment = segments[segments.length - 1]
        return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
    }, [pathname])

    return (
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 shrink-0 z-20">
            {/* Mobile Menu Button */}
            <button
                className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={onMenuClick}
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb */}
            <div className="hidden md:flex items-center text-sm text-slate-500 dark:text-slate-400 gap-2">
                <div className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium">
                    Financial Zen
                </div>
                <span className="text-slate-300 dark:text-slate-600">/</span>
                <span className="font-semibold text-slate-900 dark:text-white capitalize">
                    {pageName}
                </span>
            </div>

            {/* Right Side: Notifications + Avatar */}
            <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500 dark:text-slate-400"
                    aria-label="Toggle theme"
                >
                    {mounted && theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Notifications */}
                <div className="relative">
                    <button className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <Bell size={20} className="text-slate-500 dark:text-slate-400" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                    </button>
                </div>

                {/* Divider */}
                <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700" />

                {/* User Avatar */}
                <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 rounded-full pr-3 transition-colors">
                    <div
                        className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center border border-slate-200 dark:border-slate-700"
                        style={{ backgroundImage: 'url(https://i.pravatar.cc/150?u=a042581f4e29026024d)' }}
                    />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 hidden md:block">
                        User
                    </span>
                </div>
            </div>
        </header>
    )
}

interface AppShellProps {
    children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
    const router = useRouter()

    const handleLogout = async () => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block md:w-64 fixed inset-y-0 left-0 z-30">
                <Sidebar onLogout={handleLogout} />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetContent side="left" className="p-0 w-64">
                    <Sidebar onLogout={handleLogout} />
                </SheetContent>
            </Sheet>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:ml-64">
                {/* Topbar */}
                <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-4 md:p-8 text-slate-900 dark:text-slate-200">
                    {children}
                </main>
            </div>
        </div>
    )
}
