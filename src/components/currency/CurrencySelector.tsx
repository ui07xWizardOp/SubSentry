"use client"

import { SUPPORTED_CURRENCIES, type CurrencyCode } from '@/lib/currency/converter'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface CurrencySelectorProps {
    value: CurrencyCode
    onValueChange: (value: string) => void
    disabled?: boolean
}

export function CurrencySelector({ value, onValueChange, disabled }: CurrencySelectorProps) {
    return (
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
                {SUPPORTED_CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                        <span className="flex items-center gap-2">
                            <span className="font-mono">{currency.symbol}</span>
                            <span>{currency.code}</span>
                            <span className="text-xs text-slate-500">- {currency.name}</span>
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
