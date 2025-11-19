"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Check, ArrowRight } from 'lucide-react'

const POPULAR_SERVICES = [
    { name: 'Netflix', price: 15.99, category: 'Streaming', color: 'bg-red-500' },
    { name: 'Spotify', price: 9.99, category: 'Music', color: 'bg-green-500' },
    { name: 'Disney+', price: 7.99, category: 'Streaming', color: 'bg-blue-500' },
    { name: 'Amazon Prime', price: 14.99, category: 'Streaming', color: 'bg-amber-500' },
    { name: 'YouTube Premium', price: 11.99, category: 'Streaming', color: 'bg-red-600' },
    { name: 'Apple Music', price: 9.99, category: 'Music', color: 'bg-pink-500' },
    { name: 'Adobe Creative Cloud', price: 54.99, category: 'Productivity', color: 'bg-rose-600' },
    { name: 'GitHub Pro', price: 4, category: 'Productivity', color: 'bg-slate-800' },
    { name: 'Microsoft 365', price: 6.99, category: 'Productivity', color: 'bg-blue-600' },
    { name: 'Dropbox', price: 11.99, category: 'Cloud Storage', color: 'bg-blue-400' },
    { name: 'Notion', price: 8, category: 'Productivity', color: 'bg-slate-700' },
    { name: 'Hulu', price: 7.99, category: 'Streaming', color: 'bg-green-600' },
]

const CATEGORIES = ['All', 'Streaming', 'Music', 'Productivity', 'Cloud Storage']

export function OnboardingClient() {
    const router = useRouter()
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState('All')

    const toggleSelection = (serviceName: string) => {
        const newSelected = new Set(selected) // Creates new Set - React will detect change
        if (newSelected.has(serviceName)) {
            newSelected.delete(serviceName)
        } else {
            newSelected.add(serviceName)
        }
        setSelected(newSelected)
    }

    // TODO: Implement actual subscription creation API call on continue
    const handleContinue = async () => {
        // Will batch-create subscriptions from selected Set
        router.push('/dashboard')
    }

    const filteredServices = POPULAR_SERVICES.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = activeCategory === 'All' || service.category === activeCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="container max-w-6xl mx-auto py-12 px-4">
                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-medium">Step 1 of 1</span>
                        <span>•</span>
                        <span>Quick setup</span>
                    </div>
                </div>

                {/* Header */}
                <div className="mb-8 space-y-3">
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-bold">Let's set up your subscriptions</h1>
                        {selected.size > 0 && (
                            <Badge variant="secondary" className="text-base px-3 py-1">
                                {selected.size} selected
                            </Badge>
                        )}
                    </div>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Select the services you currently use. You can add custom ones later.
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="mb-6 space-y-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {CATEGORIES.map(category => (
                            <Badge
                                key={category}
                                variant={activeCategory === category ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Subscription Grid */}
                <ScrollArea className="h-[500px] mb-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pr-4">
                        {filteredServices.map(service => {
                            const isSelected = selected.has(service.name)
                            return (
                                <Card
                                    key={service.name}
                                    className={`cursor-pointer transition-all hover:shadow-md ${isSelected
                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20'
                                            : 'border-slate-200 dark:border-slate-800'
                                        }`}
                                    onClick={() => toggleSelection(service.name)}
                                >
                                    <div className="p-4 space-y-3 relative">
                                        {/* Selected Indicator */}
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}

                                        {/* Avatar */}
                                        <Avatar className="w-12 h-12">
                                            <AvatarFallback className={service.color}>
                                                {service.name[0]}
                                            </AvatarFallback>
                                        </Avatar>

                                        {/* Service Info */}
                                        <div>
                                            <h3 className="font-semibold text-sm">{service.name}</h3>
                                            <p className="text-xs text-slate-500">
                                                From ${service.price}/mo
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                </ScrollArea>

                {/* Bottom Actions - Sticky */}
                <div className="sticky bottom-0 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 p-6 -mx-4">
                    <div className="container max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            You can add, edit, or remove these anytime in your dashboard
                        </p>

                        <div className="flex items-center gap-3">
                            {/* Link for navigation - using Button with asChild */}
                            <Button variant="ghost" asChild>
                                <a href="/dashboard">Skip for now</a> {/* NOTE: Ensure /dashboard route exists and auth middleware allows access */}
                            </Button>
                            <Button
                                size="lg"
                                disabled={selected.size === 0}
                                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
                                onClick={handleContinue}
                            >
                                Continue with {selected.size} subscription{selected.size !== 1 ? 's' : ''}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
