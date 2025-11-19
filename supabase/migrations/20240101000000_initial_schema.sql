-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends auth.users)
-- We'll use a separate table for user settings to keep it clean, 
-- but we can also just query this table for profile info if needed.
create table public.user_settings (
  user_id uuid references auth.users(id) on delete cascade not null primary key,
  default_reminder_days integer default 3,
  currency text default 'USD',
  timezone text default 'UTC',
  email_notifications_enabled boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Categories table
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  color_hex text default '#000000',
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Subscriptions table
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  service_name text not null,
  amount numeric(10, 2) not null,
  billing_cycle text check (billing_cycle in ('monthly', 'yearly', 'weekly')) not null,
  start_date date not null,
  next_renewal_date date not null,
  reminder_days_before integer default 3,
  status text check (status in ('active', 'paused', 'archived')) default 'active',
  category_id uuid references public.categories(id) on delete set null,
  is_trial boolean default false,
  notes text,
  website_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Notification Log table
create table public.notification_log (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  subscription_id uuid references public.subscriptions(id) on delete cascade not null,
  sent_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'sent',
  type text default 'reminder'
);

-- RLS Policies

-- Enable RLS on all tables
alter table public.user_settings enable row level security;
alter table public.categories enable row level security;
alter table public.subscriptions enable row level security;
alter table public.notification_log enable row level security;

-- User Settings Policies
create policy "Users can view their own settings"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "Users can update their own settings"
  on public.user_settings for update
  using (auth.uid() = user_id);

create policy "Users can insert their own settings"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

-- Subscriptions Policies
create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own subscriptions"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own subscriptions"
  on public.subscriptions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own subscriptions"
  on public.subscriptions for delete
  using (auth.uid() = user_id);

-- Notification Log Policies
create policy "Users can view their own notification logs"
  on public.notification_log for select
  using (auth.uid() = user_id);

-- Categories Policies
alter table public.categories add column is_global boolean default false;
alter table public.categories add column user_id uuid references auth.users(id) on delete cascade;

create policy "Users can view global categories or their own"
  on public.categories for select
  using (is_global = true or auth.uid() = user_id);

create policy "Users can insert their own categories"
  on public.categories for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own categories"
  on public.categories for update
  using (auth.uid() = user_id);

create policy "Users can delete their own categories"
  on public.categories for delete
  using (auth.uid() = user_id);

-- Indexes for performance
create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_next_renewal on public.subscriptions(next_renewal_date);
create index idx_notification_log_subscription_id on public.notification_log(subscription_id);
