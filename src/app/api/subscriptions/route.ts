import { NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const subscriptionSchema = z.object({
    name: z.string().min(1),
    amount: z.number().positive(),
    billingCycle: z.enum(["monthly", "yearly"]),
    nextRenewalDate: z.string(), // ISO date "YYYY-MM-DD"
    category: z.string().optional(),
})

export async function POST(req: Request) {
    try {
        const json = await req.json()
        const parsed = subscriptionSchema.safeParse(json)

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid data", details: parsed.error.flatten() },
                { status: 400 },
            )
        }

        const supabase = await createClient()
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            )
        }

        const payload = {
            user_id: user.id,
            name: parsed.data.name, // Changed from service_name to name based on schema inference, need to verify DB schema if it fails
            amount: parsed.data.amount,
            billing_cycle: parsed.data.billingCycle,
            next_renewal_date: parsed.data.nextRenewalDate,
            category: parsed.data.category ?? null,
            status: "active",
            currency: "USD", // Default currency
            start_date: new Date().toISOString(), // Default start date to now
        }

        const { data, error } = await supabase
            .from("subscriptions")
            .insert(payload)
            .select()
            .single()

        if (error) {
            console.error("Supabase insert error:", error)
            return NextResponse.json(
                { error: error.message },
                { status: 500 },
            )
        }

        return NextResponse.json({ subscription: data }, { status: 201 })
    } catch (err) {
        console.error("POST /api/subscriptions error", err)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        )
    }
}
