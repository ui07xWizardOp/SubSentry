"use client"

import { ReactNode } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Navbar } from "./Navbar"

type AppShellProps = {
    children: ReactNode
    currentUser: {
        name: string
        email: string
    } | null
}

export function AppShell({ children, currentUser }: AppShellProps) {
    const initials =
        currentUser?.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() ?? "SS"

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
            {/* Sidebar - Assuming Navbar acts as sidebar or top nav, keeping structure similar to previous but adapting to new shell */}
            <Navbar />

            <div className="flex-1 flex flex-col pl-64"> {/* Added padding-left to account for fixed sidebar if Navbar is sidebar */}
                {/* Topbar */}
                <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
                    {/* Left: Logo / Breadcrumbs */}
                    <div className="font-semibold text-sm md:text-base">
                        {/* breadcrumb or logo */}
                        Dashboard
                    </div>

                    {/* Right: User menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="flex items-center gap-2 px-2 md:px-3"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="hidden md:flex flex-col items-start">
                                    <span className="text-xs font-medium">
                                        {currentUser?.name ?? "Guest"}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {currentUser?.email ?? ""}
                                    </span>
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>My account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    )
}
