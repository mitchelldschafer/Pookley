import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Grid, List, Sun, Moon, Download, Shuffle, Filter, Calendar, Code, Activity, Crown, Star, Lock } from 'lucide-react';
import { AppCard } from './components/AppCard';
import { PricingModal } from './components/PricingModal';
import { StatsWidget } from './components/StatsWidget';
import { sampleApps } from './data/sampleApps';
import type { App, Category, SortOption } from './types';

function App() {
  const [apps, setApps] = useState<App[]>(sampleApps);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [darkMode, setDarkMode] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [userTier, setUserTier] = useState<'free' | 'pro' | 'premium'>('free');

  const categories: { value: Category | 'all'; label: string; color: string }[] = [
    { value: 'all', label: 'All Apps', color: 'bg-blue-500' },
    { value: 'productivity', label: 'Productivity', color: 'bg-green-500' },
    { value: 'games', label: 'Games', color: 'bg-purple-500' },
    { value: 'utilities', label: 'Utilities', color: 'bg-orange-500' },
    { value: 'tools', label: 'Tools', color: 'bg-red-500' },
    { value: 'design', label: 'Design', color: 'bg-pink-500' },
    { value: 'security', label: 'Security', color: 'bg-yellow-500' },
    { value: 'lifestyle', label: 'Lifestyle', color: 'bg-indigo-500' },
    { value: 'development', label: 'Development', color: 'bg-cyan-500' },
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('pookley-theme');
    const savedViewMode = localStorage.getItem('pookley-view-mode');
    const savedUserTier = localStorage.getItem('pookley-user-tier');
    
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
    if (savedViewMode) {
      setViewMode(savedViewMode as 'grid' | 'list');
    }
    if (savedUserTier) {
      setUserTier(savedUserTier as 'free' | 'pro' | 'premium');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pookley-theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('pookley-view-mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('pookley-user-tier', userTier);
  }, [userTier]);

  const filteredAndSortedApps = useMemo(() => {
    let filtered = apps.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'oldest':
          return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'mostUsed':
          return (b.usage || 0) - (a.usage || 0);
        default:
          return 0;
      }
    });
  }, [apps, searchTerm, selectedCategory, sortBy]);

  const handleRandomApp = () => {
    const accessibleApps = filteredAndSortedApps.filter(app => 
      userTier === 'premium' || 
      (userTier === 'pro' && app.tier !== 'premium') || 
      (userTier === 'free' && app.tier === 'free')
    );
    
    if (accessibleApps.length > 0) {
      const randomApp = accessibleApps[Math.floor(Math.random() * accessibleApps.length)];
      window.open(randomApp.liveUrl, '_blank');
    }
  };

  const exportApps = () => {
    const dataStr = JSON.stringify(apps, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pookley-apps.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const getTierBadge = () => {
    const badges = {
      free: { label: 'Free', color: 'bg-gray-500', icon: null },
      pro: { label: 'Pro', color: 'bg-blue-500', icon: Star },
      premium: { label: 'Premium', color: 'bg-gradient-to-r from-yellow-400 to-orange-500', icon: Crown }
    };
    
    const badge = badges[userTier];
    const Icon = badge.icon;
    
    return (
      <div className={`px-3 py-1 rounded-full text-white text-sm font-medium flex items-center space-x-1 ${badge.color}`}>
        {Icon && <Icon className="w-4 h-4" />}
        <span>{badge.label}</span>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Pookley
                </h1>
              </div>
              {getTierBadge()}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPricingModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 text-sm font-medium"
              >
                {userTier === 'free' ? 'Upgrade' : 'Manage Plan'}
              </button>
              
              <button
                onClick={handleRandomApp}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                title="Random App"
              >
                <Shuffle className="w-5 h-5" />
              </button>
              
              <button
                onClick={exportApps}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                title="Export Apps"
              >
                <Download className="w-5 h-5" />
              </button>

              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                title="Toggle View"
              >
                {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                title="Toggle Theme"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-bold mb-6">
            Premium Apps
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Built for You
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Access a curated collection of professional-grade applications. From productivity tools to creative utilities, everything you need in one subscription.
          </p>
          
          {userTier === 'free' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Lock className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">Limited Access</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                You're currently on the free plan. Upgrade to unlock all premium apps and features.
              </p>
              <button
                onClick={() => setShowPricingModal(true)}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium"
              >
                View Plans
              </button>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto mb-12">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search apps, technologies, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">A-Z</option>
                <option value="mostUsed">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map(({ value, label, color }) => (
              <button
                key={value}
                onClick={() => setSelectedCategory(value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                  selectedCategory === value
                    ? `${color} text-white shadow-lg`
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Widgets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <StatsWidget apps={apps} userTier={userTier} />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredAndSortedApps.length === 0 ? (
          <div className="text-center py-20">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No apps found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}>
            {filteredAndSortedApps.map((app) => (
              <AppCard key={app.id} app={app} viewMode={viewMode} userTier={userTier} />
            ))}
          </div>
        )}
      </main>

      {/* Pricing Modal */}
      {showPricingModal && (
        <PricingModal
          onClose={() => setShowPricingModal(false)}
          currentTier={userTier}
          onTierChange={setUserTier}
        />
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800 dark:text-gray-200">Pookley</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                Premium applications crafted with attention to detail. Join thousands of users who trust Pookley for their daily productivity and creative needs.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>{apps.length} Apps Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Updated Weekly</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-blue-500 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Changelog</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-blue-500 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 Pookley. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">Privacy</a>
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">Terms</a>
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;