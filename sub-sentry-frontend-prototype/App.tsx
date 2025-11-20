import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  CreditCard, 
  PieChart, 
  Settings, 
  Plus, 
  Bell, 
  Search, 
  Check, 
  Shield, 
  LogOut,
  TrendingUp,
  ChevronRight,
  MoreHorizontal,
  Trash2,
  Edit2,
  Menu,
  X,
  Moon,
  Sun,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart as RePieChart,
  Pie
} from 'recharts';

import { AppView, Subscription } from './types';
import { MOCK_SUBSCRIPTIONS, CATEGORY_COLORS, ONBOARDING_SERVICES } from './constants';
import { Button, Card, HeadingLG, HeadingMD, HeadingXL, Input, PrivacyBadge, Badge } from './components/UIComponents';

// --- Screens ---

const LandingScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <nav className="w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="bg-primary-600 p-2 rounded-lg text-white">
          <Shield size={24} />
        </div>
        <span className="text-xl font-display font-bold text-slate-900 dark:text-white">Sub Sentry</span>
      </div>
      <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
        <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Features</a>
        <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Pricing</a>
        <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Blog</a>
      </div>
      <Button variant="secondary" onClick={onStart} size="sm">Log In</Button>
    </nav>

    <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mt-10 md:mt-20 mb-20">
      <PrivacyBadge />
      <h1 className="mt-8 text-5xl md:text-7xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
        Stop wasting money on <br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-violet-600 dark:from-primary-400 dark:to-violet-400">forgotten subscriptions</span>
      </h1>
      <p className="mt-6 text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
        Track all your recurring expenses in one place. We notify you before you get charged. 
        No intrusive bank connections required.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Button size="lg" onClick={onStart} className="shadow-xl shadow-primary-500/20">Start Tracking Now</Button>
        <Button size="lg" variant="secondary" onClick={() => {}}>View Demo</Button>
      </div>

      {/* Feature Grid */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full">
        {[
          { icon: <CreditCard className="text-primary-600 dark:text-primary-400" />, title: "Track Spending", desc: "See all recurring payments in a unified dashboard." },
          { icon: <Bell className="text-primary-600 dark:text-primary-400" />, title: "Smart Reminders", desc: "Get alerted 3 days before any renewal hits your card." },
          { icon: <Shield className="text-primary-600 dark:text-primary-400" />, title: "Privacy First", desc: "Your data stays siloed. We never sell your financial habits." }
        ].map((f, i) => (
          <Card key={i} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
            <div className="bg-primary-50 dark:bg-primary-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              {f.icon}
            </div>
            <HeadingMD className="mb-2">{f.title}</HeadingMD>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
          </Card>
        ))}
      </div>
    </main>
  </div>
);

const LoginScreen: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
    <Card className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="bg-primary-600 text-white p-3 rounded-xl inline-block mb-4 shadow-glow">
          <Shield size={32} />
        </div>
        <HeadingXL>Welcome back</HeadingXL>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to your privacy-first dashboard</p>
      </div>
      
      <div className="space-y-5">
        <Input label="Email" type="email" placeholder="you@example.com" />
        <div>
            <Input label="Password" type="password" placeholder="••••••••" />
            <div className="flex justify-end mt-1">
                <a href="#" className="text-xs font-medium text-primary-600 hover:underline">Forgot password?</a>
            </div>
        </div>
        
        <Button className="w-full" size="lg" onClick={onSuccess}>Sign In</Button>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">Or continue with</span></div>
        </div>

        <Button variant="secondary" className="w-full flex gap-2 justify-center items-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Sign in with Google
        </Button>

        <div className="mt-6 flex justify-center">
             <PrivacyBadge />
        </div>
      </div>
    </Card>
  </div>
);

const OnboardingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (name: string) => {
    if (selected.includes(name)) setSelected(selected.filter(s => s !== name));
    else setSelected([...selected, name]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
           <div className="bg-primary-600 p-1.5 rounded text-white"><Shield size={18} /></div>
           <span className="font-bold text-slate-900 dark:text-white">Sub Sentry</span>
        </div>
        <div className="bg-slate-100 dark:bg-slate-700 h-10 w-10 rounded-full bg-cover bg-center" style={{backgroundImage: 'url(https://i.pravatar.cc/150?u=a042581f4e29026024d)'}}></div>
      </header>
      
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 pb-24">
        <div className="mb-8 text-center md:text-left">
           <HeadingXL>Let's set up your subscriptions</HeadingXL>
           <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Select the services you use. We'll help you track them.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none shadow-sm" placeholder="Search for a service..." />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                <Badge color="bg-primary-50 text-primary-700 ring-1 ring-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:ring-primary-700">All</Badge>
                <Badge>Entertainment</Badge>
                <Badge>Productivity</Badge>
                <Badge>Utilities</Badge>
            </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {ONBOARDING_SERVICES.map((service) => {
                const isSelected = selected.includes(service.name);
                return (
                    <div 
                        key={service.name}
                        onClick={() => toggle(service.name)}
                        className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-4 aspect-square bg-white dark:bg-slate-800 ${isSelected ? 'border-primary-500 ring-4 ring-primary-50 dark:ring-primary-900/30 shadow-lg' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-sm'}`}
                    >
                        <img src={service.icon} alt={service.name} className="w-12 h-12 object-contain rounded-lg bg-white" />
                        <span className="font-semibold text-slate-900 dark:text-white">{service.name}</span>
                        {isSelected && (
                            <div className="absolute top-3 right-3 bg-primary-600 text-white rounded-full p-1">
                                <Check size={14} strokeWidth={3} />
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 z-20">
        <div className="max-w-5xl mx-auto flex justify-end items-center gap-4">
            <Button variant="secondary" onClick={onComplete}>Skip</Button>
            <Button onClick={onComplete} disabled={selected.length === 0} className="w-32">
                Continue {selected.length > 0 && `(${selected.length})`}
            </Button>
        </div>
      </footer>
    </div>
  );
};

const AddSubscriptionModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
    <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-start mb-6">
        <HeadingLG>Add Subscription</HeadingLG>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400"><X size={20} /></button>
      </div>
      
      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
        <Input label="Service Name" placeholder="e.g. Netflix" />
        
        <div className="grid grid-cols-2 gap-4">
             <Input label="Amount" type="number" placeholder="0.00" icon={<span className="text-sm font-bold">$</span>} />
             <div>
                 <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Cycle</label>
                 <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none">
                     <option>Monthly</option>
                     <option>Yearly</option>
                 </select>
             </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <Input label="First Bill Date" type="date" />
            <Input label="Due Date" type="date" />
        </div>
        
        <div>
             <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Category</label>
             <div className="flex flex-wrap gap-2">
                 {['Entertainment', 'Productivity', 'Utilities', 'Cloud'].map(cat => (
                     <button key={cat} type="button" className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">{cat}</button>
                 ))}
             </div>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-xl flex items-start gap-3">
             <Bell size={20} className="text-indigo-600 dark:text-indigo-400 mt-0.5" />
             <div>
                 <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">Smart Reminder</p>
                 <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">We'll notify you 3 days before the renewal date.</p>
             </div>
             <input type="checkbox" defaultChecked className="ml-auto w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600" />
        </div>

        <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1">Save Subscription</Button>
        </div>
      </form>
    </Card>
  </div>
);

// --- Dashboard View ---
const DashboardView: React.FC = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Auto-refresh simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshing(true);
      setTimeout(() => {
        setLastUpdated(new Date());
        setRefreshing(false);
      }, 1000); // Fake network request
    }, 60000); // Refresh every 60s

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
      setRefreshing(true);
      setTimeout(() => {
        setLastUpdated(new Date());
        setRefreshing(false);
      }, 800);
  };

  const filteredSubscriptions = MOCK_SUBSCRIPTIONS.filter(sub => 
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sub.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSpend = filteredSubscriptions.reduce((acc, sub) => acc + sub.price, 0);
  
  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-xs">
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <button onClick={handleManualRefresh} className={`p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all ${refreshing ? 'animate-spin text-primary-600' : ''}`}>
                <RefreshCw size={14} />
            </button>
        </div>
        <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
                type="text" 
                placeholder="Search subscriptions..." 
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-5"><CreditCard size={80} /></div>
           <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Monthly Spend</p>
           <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">${totalSpend.toFixed(2)}</p>
           <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold mt-2">
             <TrendingUp size={14} /> <span>+2.5%</span> <span className="text-slate-400 font-normal ml-1">vs last month</span>
           </div>
        </Card>
        <Card>
           <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Yearly Projection</p>
           <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">${(totalSpend * 12).toFixed(2)}</p>
        </Card>
        <Card>
           <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Active Subs</p>
           <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{filteredSubscriptions.length}</p>
        </Card>
        <Card>
           <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Upcoming Renewals</p>
           <p className="text-3xl font-bold text-emerald-500 mt-2">3</p>
           <p className="text-slate-400 text-xs mt-1">Next 7 days</p>
        </Card>
      </div>

      {/* List Section */}
      <div>
        <div className="flex justify-between items-end mb-4">
            <HeadingLG>Your Subscriptions</HeadingLG>
            <Button size="sm" className="gap-2"><Plus size={16} /> Add New</Button>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Due Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Renewal Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {filteredSubscriptions.length > 0 ? (
                            filteredSubscriptions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img src={sub.icon} className="w-8 h-8 rounded-full object-cover bg-slate-100 dark:bg-slate-700" alt={sub.name} />
                                            <span className="font-semibold text-slate-900 dark:text-white">{sub.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[sub.category] || 'bg-slate-100 text-slate-600'}`}>
                                            {sub.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                                        {sub.currency}{sub.price.toFixed(2)}<span className="text-slate-400 text-xs font-normal">/mo</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-slate-600 dark:text-slate-300">
                                        {sub.dueDate}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                        Renews in <span className="font-bold text-slate-900 dark:text-white">12 days</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded"><Edit2 size={16} /></button>
                                            <button className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                    No subscriptions found matching "{searchQuery}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

const AnalyticsView: React.FC = () => {
  const data = [
    { name: 'Jan', amount: 210 },
    { name: 'Feb', amount: 230 },
    { name: 'Mar', amount: 225 },
    { name: 'Apr', amount: 245 },
    { name: 'May', amount: 240 },
    { name: 'Jun', amount: 260 },
  ];

  const pieData = [
    { name: 'Entertainment', value: 45, color: '#8884d8' },
    { name: 'Productivity', value: 30, color: '#82ca9d' },
    { name: 'Utilities', value: 25, color: '#ffc658' },
  ];
  
  const totalValue = pieData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <HeadingLG>Analytics & Spending Insights</HeadingLG>
            <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary-500">
                <option>Last 30 Days</option>
                <option>This Year</option>
            </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <HeadingMD className="mb-6">Monthly Trend</HeadingMD>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
                            <Tooltip 
                                cursor={{fill: '#f1f5f9'}}
                                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)'}} 
                            />
                            <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <div className="flex flex-col gap-6">
                <Card className="flex-1">
                    <HeadingMD className="mb-6">Category Split</HeadingMD>
                    <div className="h-48 w-full relative">
                         <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </RePieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                            <p className="text-xs text-slate-400 font-semibold uppercase">Total</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">$245</p>
                        </div>
                    </div>
                </Card>
                
                <Card className="flex-1 overflow-hidden">
                    <HeadingMD className="mb-4">Breakdown</HeadingMD>
                    <div className="space-y-3">
                        {pieData.map((entry, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: entry.color}}></div>
                                    <span className="text-slate-700 dark:text-slate-300">{entry.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-slate-900 dark:text-white">${entry.value}</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 w-10 text-right">
                                        {Math.round((entry.value / totalValue) * 100)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    </div>
  );
};

const CalendarView: React.FC = () => {
    const days = Array.from({length: 31}, (_, i) => i + 1);
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <HeadingLG>October 2023</HeadingLG>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm">Today</Button>
                    <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                        <button className="px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 border-r border-slate-200 dark:border-slate-700"><ChevronRight className="rotate-180" size={16} /></button>
                        <button className="px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 auto-rows-[120px] divide-x divide-y divide-slate-100 dark:divide-slate-700">
                    {/* Empty previous days */}
                    <div className="bg-slate-50/30 dark:bg-slate-900/30"></div>
                    <div className="bg-slate-50/30 dark:bg-slate-900/30"></div>
                    
                    {days.map(day => {
                         const subs = MOCK_SUBSCRIPTIONS.filter(s => {
                             // Mock logic to distribute subs
                             const d = new Date(s.renewalDate).getDate();
                             return d === day || (day === 15 && s.name === 'Netflix') || (day === 5 && s.name === 'Adobe CC');
                         });

                         return (
                            <div key={day} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative group">
                                <span className={`text-sm font-medium ${day === 12 ? 'bg-primary-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-700 dark:text-slate-300'}`}>{day}</span>
                                <div className="mt-2 space-y-1.5">
                                    {subs.map((sub, i) => (
                                        <div key={i} className={`px-2 py-1 rounded-md text-xs font-semibold truncate border shadow-sm ${
                                            sub.category === 'Entertainment' ? 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800' :
                                            sub.category === 'Productivity' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800' :
                                            'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800'
                                        }`}>
                                            {sub.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                         );
                    })}
                </div>
            </Card>
        </div>
    );
};

const SettingsView: React.FC<{ isDarkMode: boolean, toggleTheme: () => void }> = ({ isDarkMode, toggleTheme }) => (
    <div className="max-w-3xl">
        <HeadingLG className="mb-6">Settings</HeadingLG>
        
        <div className="space-y-6">
            <Card>
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                    <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center" style={{backgroundImage: 'url(https://i.pravatar.cc/150?u=a042581f4e29026024d)'}}></div>
                    <div>
                        <HeadingMD>Olivia Rhye</HeadingMD>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">olivia@subsentry.com</p>
                    </div>
                    <Button variant="secondary" className="ml-auto">Edit Profile</Button>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <Input label="Full Name" defaultValue="Olivia Rhye" />
                        <Input label="Email Address" defaultValue="olivia@subsentry.com" />
                    </div>
                </div>
            </Card>

            <Card>
                <HeadingMD className="mb-4">Appearance</HeadingMD>
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                             {isDarkMode ? <Moon size={18} className="text-indigo-400"/> : <Sun size={18} className="text-orange-400" />}
                             Dark Mode
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Toggle the application theme.</p>
                    </div>
                    <button 
                        onClick={toggleTheme}
                        className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${isDarkMode ? 'bg-primary-600' : 'bg-slate-200'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isDarkMode ? 'left-6' : 'left-1'}`}></div>
                    </button>
                </div>
            </Card>

            <Card>
                <HeadingMD className="mb-4">App Preferences</HeadingMD>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Default Currency</label>
                        <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none">
                            <option>USD - United States Dollar</option>
                            <option>EUR - Euro</option>
                        </select>
                    </div>
                    <Input label="Monthly Budget Goal" type="number" defaultValue="500" icon={<span className="text-sm font-bold">$</span>} />
                </div>
            </Card>

            <Card>
                <HeadingMD className="mb-4">Notifications</HeadingMD>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <div>
                            <p className="font-semibold text-slate-900 dark:text-white">Upcoming Payment Reminders</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Get alerted 3 days before renewal.</p>
                        </div>
                        <div className="w-11 h-6 bg-primary-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <div>
                            <p className="font-semibold text-slate-900 dark:text-white">Weekly Spending Summary</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Receive a summary every Monday.</p>
                        </div>
                         <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                    </div>
                </div>
            </Card>

            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl flex justify-between items-center">
                <div className="text-red-800 dark:text-red-200">
                    <p className="font-bold">Delete Account</p>
                    <p className="text-sm opacity-80">Permanently delete your data and subscriptions.</p>
                </div>
                <Button variant="danger" size="sm">Delete</Button>
            </div>
        </div>
    </div>
);

// --- Main Layout ---

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; isActive?: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
      isActive 
        ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25' 
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
    }`}
  >
    {React.cloneElement(icon as React.ReactElement<any>, { size: 20, strokeWidth: isActive ? 2.5 : 2 })}
    <span>{label}</span>
  </button>
);

const AppShell: React.FC<{ children: React.ReactNode, view: AppView, setView: (v: AppView) => void, onLogout: () => void }> = ({ children, view, setView, onLogout }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 flex items-center gap-2 border-b border-slate-50 dark:border-slate-800">
                    <div className="bg-primary-600 p-1.5 rounded-lg text-white"><Shield size={20} /></div>
                    <span className="text-xl font-display font-extrabold text-slate-900 dark:text-white">Sub Sentry</span>
                </div>

                <div className="p-4 space-y-2">
                    <SidebarItem 
                        icon={<LayoutDashboard />} 
                        label="Dashboard" 
                        isActive={view === AppView.DASHBOARD} 
                        onClick={() => { setView(AppView.DASHBOARD); setIsMobileMenuOpen(false); }} 
                    />
                    <SidebarItem 
                        icon={<CreditCard />} 
                        label="Subscriptions" 
                        isActive={false} 
                        onClick={() => { setIsMobileMenuOpen(false); }} 
                    />
                    <SidebarItem 
                        icon={<CalendarIcon />} 
                        label="Calendar" 
                        isActive={view === AppView.CALENDAR} 
                        onClick={() => { setView(AppView.CALENDAR); setIsMobileMenuOpen(false); }} 
                    />
                    <SidebarItem 
                        icon={<PieChart />} 
                        label="Analytics" 
                        isActive={view === AppView.ANALYTICS} 
                        onClick={() => { setView(AppView.ANALYTICS); setIsMobileMenuOpen(false); }} 
                    />
                    <SidebarItem 
                        icon={<Settings />} 
                        label="Settings" 
                        isActive={view === AppView.SETTINGS} 
                        onClick={() => { setView(AppView.SETTINGS); setIsMobileMenuOpen(false); }} 
                    />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 dark:border-slate-800">
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors font-medium">
                        <LogOut size={20} />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 shrink-0 z-20">
                    <button className="md:hidden p-2 text-slate-600 dark:text-slate-300" onClick={() => setIsMobileMenuOpen(true)}><Menu /></button>
                    
                    <div className="hidden md:flex items-center text-sm text-slate-500 dark:text-slate-400 gap-2">
                        <div className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">Financial Zen</div>
                        <span className="text-slate-300 dark:text-slate-600">/</span>
                        <span className="font-semibold text-slate-900 dark:text-white capitalize">{view.toLowerCase()}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Bell size={20} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </div>
                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2"></div>
                        <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 rounded-full pr-3 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center border border-slate-200 dark:border-slate-700" style={{backgroundImage: 'url(https://i.pravatar.cc/150?u=a042581f4e29026024d)'}}></div>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 hidden md:block">Olivia</span>
                        </div>
                    </div>
                </header>

                {/* Main Scrollable Area */}
                <main className="flex-1 overflow-auto p-4 md:p-8 text-slate-900 dark:text-slate-200">
                     {children}
                </main>
            </div>
            
            {/* Overlay for mobile menu */}
            {isMobileMenuOpen && <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-20 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}
        </div>
    );
}

// --- Root App ---

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <DashboardView />;
      case AppView.CALENDAR:
        return <CalendarView />;
      case AppView.ANALYTICS:
        return <AnalyticsView />;
      case AppView.SETTINGS:
        return <SettingsView isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      default:
        return <DashboardView />;
    }
  };

  // Route Guards
  if (currentView === AppView.LANDING) {
    return <LandingScreen onStart={() => setCurrentView(AppView.LOGIN)} />;
  }

  if (currentView === AppView.LOGIN) {
    return <LoginScreen onSuccess={() => setCurrentView(AppView.ONBOARDING)} />;
  }

  if (currentView === AppView.ONBOARDING) {
    return <OnboardingScreen onComplete={() => setCurrentView(AppView.DASHBOARD)} />;
  }

  return (
    <AppShell view={currentView} setView={setCurrentView} onLogout={() => setCurrentView(AppView.LANDING)}>
        {renderContent()}
        {showAddModal && <AddSubscriptionModal onClose={() => setShowAddModal(false)} />}
        {/* Floating Action Button for Add */}
        <button 
            onClick={() => setShowAddModal(true)}
            className="fixed bottom-8 right-8 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg shadow-primary-600/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-40"
        >
            <Plus size={28} />
        </button>
    </AppShell>
  );
}
