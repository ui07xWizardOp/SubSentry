import { Subscription } from './types';

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: '1',
    name: 'Netflix',
    price: 15.49,
    currency: '$',
    category: 'Entertainment',
    renewalDate: '2023-10-15',
    dueDate: '2023-10-15',
    cycle: 'Monthly',
    icon: 'https://logo.clearbit.com/netflix.com',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Spotify',
    price: 9.99,
    currency: '$',
    category: 'Music',
    renewalDate: '2023-10-22',
    dueDate: '2023-10-22',
    cycle: 'Monthly',
    icon: 'https://logo.clearbit.com/spotify.com',
    status: 'Active'
  },
  {
    id: '3',
    name: 'Adobe CC',
    price: 54.99,
    currency: '$',
    category: 'Productivity',
    renewalDate: '2023-10-05',
    dueDate: '2023-10-05',
    cycle: 'Monthly',
    icon: 'https://logo.clearbit.com/adobe.com',
    status: 'Active'
  },
  {
    id: '4',
    name: 'Amazon Prime',
    price: 14.99,
    currency: '$',
    category: 'Shopping',
    renewalDate: '2023-10-18',
    dueDate: '2023-10-18',
    cycle: 'Monthly',
    icon: 'https://logo.clearbit.com/amazon.com',
    status: 'Active'
  },
  {
    id: '5',
    name: 'Dropbox',
    price: 11.99,
    currency: '$',
    category: 'Cloud',
    renewalDate: '2023-10-30',
    dueDate: '2023-10-30',
    cycle: 'Monthly',
    icon: 'https://logo.clearbit.com/dropbox.com',
    status: 'Active'
  }
];

export const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  Productivity: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  Music: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  Shopping: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  Utilities: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  Cloud: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'
};

export const ONBOARDING_SERVICES = [
  { name: 'Netflix', icon: 'https://logo.clearbit.com/netflix.com' },
  { name: 'Spotify', icon: 'https://logo.clearbit.com/spotify.com' },
  { name: 'Adobe CC', icon: 'https://logo.clearbit.com/adobe.com' },
  { name: 'Amazon Prime', icon: 'https://logo.clearbit.com/amazon.com' },
  { name: 'Dropbox', icon: 'https://logo.clearbit.com/dropbox.com' },
  { name: 'Notion', icon: 'https://logo.clearbit.com/notion.so' },
  { name: 'Slack', icon: 'https://logo.clearbit.com/slack.com' },
  { name: 'Apple Music', icon: 'https://logo.clearbit.com/apple.com' },
];