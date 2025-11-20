# SubSentry - Subscription Tracker

A privacy-first subscription management application built with Next.js, Supabase, and the Financial Zen design system.

## 🚀 Features

- **Subscription Management**: Track, add, edit, pause, and delete subscriptions
- **Multi-Currency Support**: 10 currencies with real-time conversion
- **Analytics Dashboard**: Visual insights into spending patterns
- **Calendar View**: See all renewal dates at a glance
- **Smart Notifications**: Email reminders for upcoming renewals
- **Data Export**: Download your subscription data anytime
- **Dark Mode**: Beautiful light and dark themes

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Authentication**: Supabase Auth
- **Email**: SendGrid (optional)
- **Analytics**: PostHog (optional)

## 📦 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/subsentry)

1. Click the button above or:
   ```bash
   vercel
   ```

2. Set the following environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SENDGRID_API_KEY` (optional)
   - `SENDGRID_FROM_EMAIL` (optional)
   - `CRON_SECRET` (for scheduled notifications)

3. Deploy!

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/subsentry.git
   cd subsentry
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SENDGRID_API_KEY=your_sendgrid_key
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com
   CRON_SECRET=your_cron_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL migrations in `supabase/setup_database.sql`
3. Enable Row Level Security policies from `supabase/migrations/001_security_constraints.sql`

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐️ Support

Give a ⭐️ if this project helped you!
