import { ReactNode } from "react"
import { Navbar } from "./Navbar"

interface AppShellProps {
    children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <main>{children}</main>
        </div>
    )
}
