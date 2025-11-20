'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FloatingActionButtonProps {
    href: string
    className?: string
}

export function FloatingActionButton({ href, className }: FloatingActionButtonProps) {
    return (
        <Link
            href={href}
            className={cn(
                'fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-600/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-40',
                className
            )}
        >
            <Plus size={28} strokeWidth={2.5} />
        </Link>
    )
}
