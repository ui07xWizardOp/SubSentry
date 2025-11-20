export enum AppView {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  CALENDAR = 'CALENDAR',
  ANALYTICS = 'ANALYTICS',
  SETTINGS = 'SETTINGS',
  ADD_SUBSCRIPTION = 'ADD_SUBSCRIPTION'
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  currency: string;
  category: 'Entertainment' | 'Productivity' | 'Music' | 'Shopping' | 'Utilities' | 'Cloud';
  renewalDate: string; // ISO Date
  dueDate: string; // ISO Date - distinct from renewal if needed, usually same for subs
  cycle: 'Monthly' | 'Yearly';
  icon: string;
  status: 'Active' | 'Paused';
}

export interface UserSettings {
  name: string;
  email: string;
  currency: string;
  monthlyBudget: number;
  notificationsEnabled: boolean;
}