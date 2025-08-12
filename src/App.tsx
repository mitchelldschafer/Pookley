import React, { useState, useMemo, useEffect } from 'react';
import { Search, Grid, List, Sun, Moon, Receipt } from 'lucide-react';
import { AppCard } from './components/AppCard';
import PricingModal from './components/PricingModal';
import { invoicingApps } from './data/sampleApps';
import type { App, UserTier, ViewMode } from './types';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'usage' | 'lastUpdated'>('name');
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('pookley-view-mode');
    return (saved as ViewMode) || 'grid';
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('pookley-dark-mode');
    return saved ? JSON.parse(saved) : false;
  });
  const [userTier, setUserTier] = useState<UserTier>(() => {
    const saved = localStorage.getItem('pookley-user-tier');
    return (saved as UserTier) || 'free';
  });
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('pookley-view-mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('pookley-dark-mode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('pookley-user-tier', userTier);
  }, [userTier]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const filteredAndSortedApps = useMemo(() => {
    let filtered = invoicingApps.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'usage':
          return b.usage - a.usage;
        case 'lastUpdated':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [searchTerm, selectedCategory, sortBy]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(invoicingApps.map(app => app.category)));
    return ['all', ...cats];
  }, []);

  const handleUpgrade = (tier: UserTier) => {
    setUserTier(tier);
    setShowPricingModal(false);
  };

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
  };

  const businessTools = {
    'crm-sales': [
      { name: 'Customer Manager', description: 'Manage customer relationships and data' },
      { name: 'Sales Pipeline', description: 'Track deals through your sales process' },
      { name: 'Lead Generator', description: 'Generate and qualify new leads' },
      { name: 'Contact Database', description: 'Centralized contact management system' }
    ],
    'finance-billing': [
      { name: 'Invoice Generator', description: 'Create professional invoices instantly' },
      { name: 'Expense Tracker', description: 'Track and categorize business expenses' },
      { name: 'Payment Processor', description: 'Accept payments from customers' },
      { name: 'Financial Reports', description: 'Generate detailed financial reports' }
    ],
    'analytics-reports': [
      { name: 'Business Dashboard', description: 'Real-time business metrics overview' },
      { name: 'Sales Analytics', description: 'Analyze sales performance and trends' },
      { name: 'Customer Insights', description: 'Understand customer behavior patterns' },
      { name: 'ROI Calculator', description: 'Calculate return on investment' }
    ],
    'communication': [
      { name: 'Email Marketing', description: 'Create and send marketing campaigns' },
      { name: 'Live Chat', description: 'Real-time customer support chat' },
      { name: 'Team Messaging', description: 'Internal team communication' },
      { name: 'Video Conferencing', description: 'Host virtual meetings and calls' }
    ],
    'productivity': [
      { name: 'Project Manager', description: 'Organize and track project progress' },
      { name: 'Time Tracker', description: 'Track time spent on tasks and projects' },
      { name: 'Document Manager', description: 'Store and organize business documents' },
      { name: 'Calendar Scheduler', description: 'Schedule meetings and appointments' }
    ],
    'inventory-orders': [
      { name: 'Inventory Manager', description: 'Track stock levels and products' },
      { name: 'Order Processor', description: 'Process and fulfill customer orders' },
      { name: 'Supplier Manager', description: 'Manage supplier relationships' },
      { name: 'Warehouse Manager', description: 'Optimize warehouse operations' }
    ]
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`} onClick={closeDropdowns}>
      <header className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-blue-600' : 'bg-blue-600'
                }`}>
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Pookley Business
                </h1>
              </div>

              <nav className="hidden md:flex items-center space-x-1">
                {[
                  { key: 'crm-sales', label: 'CRM & Sales' },
                  { key: 'finance-billing', label: 'Finance & Billing' },
                  { key: 'analytics-reports', label: 'Analytics & Reports' },
                  { key: 'communication', label: 'Communication' },
                  { key: 'productivity', label: 'Productivity' },
                  { key: 'inventory-orders', label: 'Inventory & Orders' }
                ].map(({ key, label }) => (
                  <div key={key} className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(key);
                      }}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        darkMode 
                          ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {label}
                    </button>
                    
                    {activeDropdown === key && (
                      <div className={`absolute top-full left-0 mt-1 w-64 rounded-md shadow-lg z-50 ${
                        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                      }`}>
                        <div className="py-2">
                          {businessTools[key as keyof typeof businessTools].map((tool, index) => (
                            <div
                              key={index}
                              className={`px-4 py-3 hover:bg-opacity-50 cursor-pointer transition-colors duration-200 ${
                                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {tool.name}
                              </div>
                              <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {tool.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
              >
                {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setShowPricingModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            All-in-One Business Platform
          </h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Everything your business needs in one integrated platform. From CRM to invoicing, analytics to inventory management.
          </p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                darkMode ? 'text-gray-400' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Search business tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'usage' | 'lastUpdated')}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="name">Sort by Name</option>
            <option value="usage">Sort by Usage</option>
            <option value="lastUpdated">Sort by Updated</option>
          </select>
        </div>

        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Receipt className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Invoicing & Payment Solutions
            </h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Core Business Tools
            </span>
          </div>
          
          {filteredAndSortedApps.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredAndSortedApps.map(app => (
                <AppCard
                  key={app.id}
                  app={app}
                  userTier={userTier}
                  viewMode={viewMode}
                  onUpgrade={() => setShowPricingModal(true)}
                />
              ))}
            </div>
          ) : (
            <div className={`text-center py-12 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-lg border-2 border-dashed ${
              darkMode ? 'border-gray-700' : 'border-gray-300'
            }`}>
              <Receipt className={`w-16 h-16 mx-auto mb-4 ${
                darkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h3 className={`text-lg font-medium mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Professional Financial Management Tools
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                Comprehensive invoicing, billing, and payment processing solutions for your business.
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Tools will be available here soon.
              </p>
            </div>
          )}
        </section>
      </main>

      {showPricingModal && (
        <PricingModal
          currentTier={userTier}
          onClose={() => setShowPricingModal(false)}
          onUpgrade={handleUpgrade}
        />
      )}
    </div>
  );
}

export default App;