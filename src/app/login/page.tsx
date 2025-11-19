"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Mail, Lock, Sparkles, AlertCircle, Shield } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.com',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'example-key'
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // Basic validation
        if (!email || !password) {
            setError("Please enter both email and password.")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.")
            return
        }

        setLoading(true)

        try {
            if (isSignUp) {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                })

                if (signUpError) throw signUpError

                toast({
                    title: "Check your email!",
                    description: "We've sent you a confirmation link to verify your account.",
                })

                // Clear form
                setEmail('')
                setPassword('')
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })

                if (signInError) throw signInError

                toast({
                    title: "Welcome back!",
                    description: "You've successfully logged in.",
                })

                router.push('/dashboard')
                router.refresh()
            }
        } catch (err: any) {
            console.error('Auth error:', err)

            // Provide user-friendly error messages
            let errorMessage = err.message || 'An unexpected error occurred'

            if (errorMessage.includes('Invalid login credentials')) {
                errorMessage = 'Invalid email or password. Please try again.'
            } else if (errorMessage.includes('Email not confirmed')) {
                errorMessage = 'Please confirm your email before logging in.'
            } else if (errorMessage.includes('User already registered')) {
                errorMessage = 'This email is already registered. Try logging in instead.'
            }

            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30 p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Branding */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/50">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            SubSentry
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Stop losing money to forgotten subscriptions
                        </p>
                    </div>
                </div>

                {/* Main Card */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">
                            {isSignUp ? 'Create your account' : 'Welcome back'}
                        </CardTitle>
                        <CardDescription>
                            {isSignUp
                                ? 'Start tracking your subscriptions in seconds'
                                : 'Sign in to manage your subscriptions'}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Error Alert with ARIA role */}
                        {error && (
                            <Alert variant="destructive" role="alert">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Form with proper semantics */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    {!isSignUp && (
                                        <a href="#" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                                            Forgot password?
                                        </a>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10"
                                        disabled={loading}
                                        required
                                    />
                                </div>
                                {isSignUp && (
                                    <p className="text-xs text-slate-500">
                                        Must be at least 6 characters long
                                    </p>
                                )}
                            </div>

                            {/* Primary CTA - proper button for form action */}
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
                                disabled={loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isSignUp ? 'Create account' : 'Sign in'}
                            </Button>
                        </form>

                        {/* Separator */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-slate-950 px-2 text-slate-500">or</span>
                            </div>
                        </div>

                        {/* Social Login (Placeholder) - button for action */}
                        <Button variant="outline" className="w-full" type="button" disabled>
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Sign in with Google
                        </Button>

                        {/* Toggle Sign Up / Sign In */}
                        <div className="text-center text-sm">
                            <span className="text-slate-600 dark:text-slate-400">
                                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                            </span>{' '}
                            <button
                                type="button"
                                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                                onClick={() => {
                                    setIsSignUp(!isSignUp)
                                    setEmail('')
                                    setPassword('')
                                    setError(null)
                                }}
                                disabled={loading}
                            >
                                {isSignUp ? 'Sign in' : 'Sign up'}
                            </button>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        <Badge variant="secondary" className="w-full justify-center py-2">
                            <Shield className="w-3 h-3 mr-1" />
                            Privacy-first • No bank connection
                        </Badge>
                        <div className="text-center text-xs text-slate-500">
                            By continuing, you agree to our{' '}
                            <a href="#" className="underline hover:text-slate-700">Terms</a>
                            {' '}and{' '}
                            <a href="#" className="underline hover:text-slate-700">Privacy Policy</a>
                        </div>
                    </CardFooter>
                </Card>

                {/* Trust Builder */}
                <p className="text-center text-sm text-slate-500">
                    Trusted by budget-conscious professionals
                </p>
            </div>
        </div>
    )
}
