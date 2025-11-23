import type { ReactNode } from "react"
import { AppShell } from "@/components/layout/AppShell"
import { createClient } from "@/lib/supabase/server"

export default async function MainLayout({
    children,
}: {
    children: ReactNode
}) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    return (
        <AppShell
            currentUser={{
                name: user?.user_metadata?.full_name ?? user?.email ?? "User",
                email: user?.email ?? "",
            }}
        >
            {children}
        </AppShell>
    )
}
