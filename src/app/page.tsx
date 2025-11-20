import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { ArrowRight, Bell, CreditCard, BarChart3, CheckCircle2 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Now available in beta
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-8">
              Stop paying for <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">forgotten subscriptions</span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              SubSentry helps you track, manage, and optimize your recurring expenses.
              Get renewal alerts, analyze spending, and never miss a cancellation date again.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-12 px-8 text-base bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto" asChild>
                <Link href="/login">
                  Start Tracking Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base w-full sm:w-auto">
                View Demo
              </Button>
            </div>

            {/* Hero Image Placeholder */}
            <div className="mt-20 relative mx-auto max-w-5xl">
              <div className="aspect-[16/9] rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative group">
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <p className="text-sm font-medium mb-2">Dashboard Preview</p>
                    <p className="text-xs opacity-75">Interactive dashboard showing subscription metrics</p>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              </div>
              {/* Background Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-3xl -z-10 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything you need to stay in control</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Stop relying on bank statements to find your subscriptions.
                Centralize everything in one secure dashboard.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Bell className="w-6 h-6 text-indigo-600" />}
                title="Smart Renewal Alerts"
                description="Get notified before you get charged. Set custom reminders for every subscription."
              />
              <FeatureCard
                icon={<BarChart3 className="w-6 h-6 text-violet-600" />}
                title="Spending Analytics"
                description="Visualize your monthly and yearly spend. Identify where your money is going."
              />
              <FeatureCard
                icon={<CreditCard className="w-6 h-6 text-pink-600" />}
                title="Subscription Manager"
                description="Track billing cycles, categories, and payment methods in one organized view."
              />
            </div>
          </div>
        </section>

        {/* Social Proof / Stats */}
        <section className="py-20 border-y border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">$500+</div>
                <p className="text-slate-600 dark:text-slate-400">Average annual savings</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">10k+</div>
                <p className="text-slate-600 dark:text-slate-400">Subscriptions tracked</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">100%</div>
                <p className="text-slate-600 dark:text-slate-400">Free to get started</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to take control of your finances?</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10">
              Join thousands of users who are saving money with SubSentry.
              No credit card required for the free plan.
            </p>
            <Button size="lg" className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
              <Link href="/login">Get Started for Free</Link>
            </Button>
            <p className="mt-4 text-sm text-slate-500">
              <CheckCircle2 className="inline-block w-4 h-4 mr-1 text-green-500" />
              No credit card required
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white dark:bg-slate-950 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  )
}
