import Link from 'next/link'
import { Shield } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                                <Shield className="w-5 h-5" />
                            </div>
                            <span>SubSentry</span>
                        </Link>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            Take control of your recurring expenses. Track, manage, and optimize your subscriptions in one place.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Product</h3>
                        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                            <li><Link href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400">Features</Link></li>
                            <li><Link href="#pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400">Pricing</Link></li>
                            <li><Link href="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400">Login</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                            <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">About</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Blog</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Careers</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                            <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} SubSentry. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        {/* Social links would go here */}
                    </div>
                </div>
            </div>
        </footer>
    )
}
