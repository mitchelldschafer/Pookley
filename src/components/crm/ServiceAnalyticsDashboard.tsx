import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Briefcase,
  Users,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Menu,
  X,
  Filter,
  Download,
  MapPin,
  Clock,
  CheckCircle,
  Sun,
  Cloud,
  CloudRain
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { useClients, useJobs, useTasks, useInvoices } from '../../hooks/useCrmData';
import { MoneyFormatter } from './MoneyFormatter';
import type { JobStage, TaskStatus, InvoiceStatus } from '../../types/crm';

interface ServiceAnalyticsDashboardProps {
  darkMode: boolean;
}

export const ServiceAnalyticsDashboard: React.FC<ServiceAnalyticsDashboardProps> = ({ darkMode }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [businessType, setBusinessType] = useState('services');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  // Get real data from CRM hooks
  const { clients } = useClients();
  const { jobs } = useJobs();
  const { tasks } = useTasks();
  const { invoices } = useInvoices();

  // Calculate KPIs from real data
  const kpiData = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Monthly revenue from paid invoices
    const monthlyRevenue = invoices
      .filter(inv => inv.status === 'PAID' && new Date(inv.updated_at) >= startOfMonth)
      .reduce((sum, inv) => sum + inv.amount, 0);

    // Outstanding invoices
    const outstandingInvoices = invoices
      .filter(inv => !['PAID', 'VOID'].includes(inv.status))
      .reduce((sum, inv) => sum + inv.amount, 0);

    // Overdue count
    const overdueCount = invoices.filter(inv => {
      if (inv.status === 'PAID' || inv.status === 'VOID' || !inv.due_at) return false;
      return new Date(inv.due_at) < now;
    }).length;

    // Active jobs
    const activeJobs = jobs.filter(job => 
      ['WON', 'IN_PROGRESS'].includes(job.stage)
    ).length;

    // Jobs completed this month
    const jobsCompleted = jobs.filter(job => 
      job.stage === 'COMPLETED' && new Date(job.updated_at) >= startOfMonth
    ).length;

    // Calculate profit margin (simplified)
    const totalRevenue = jobs.reduce((sum, job) => sum + job.estimated_amount, 0);
    const profitMargin = totalRevenue > 0 ? ((monthlyRevenue / totalRevenue) * 100) : 0;

    return {
      monthlyRevenue,
      monthlyRevenueChange: 12.5, // Mock change percentage
      outstandingInvoices,
      overdueCount,
      activeJobs,
      profitMargin,
      profitMarginChange: 2.1, // Mock change percentage
      jobsCompleted,
      jobsCompletedChange: 20 // Mock change percentage
    };
  }, [invoices, jobs]);

  // Generate revenue trend data from jobs
  const revenueData = useMemo(() => {
    const weeks = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
      const weekEnd = new Date(weekStart.getTime() + (7 * 24 * 60 * 60 * 1000));
      
      const weekRevenue = invoices
        .filter(inv => {
          const invDate = new Date(inv.created_at);
          return invDate >= weekStart && invDate < weekEnd && inv.status === 'PAID';
        })
        .reduce((sum, inv) => sum + inv.amount, 0);

      weeks.push({
        week: `W${12 - i}`,
        revenue: weekRevenue
      });
    }
    
    return weeks;
  }, [invoices]);

  // Top customers by revenue
  const topCustomers = useMemo(() => {
    const customerRevenue = new Map();
    
    invoices.forEach(invoice => {
      const client = clients.find(c => c.id === invoice.client_id);
      if (client && invoice.status === 'PAID') {
        const current = customerRevenue.get(client.name) || 0;
        customerRevenue.set(client.name, current + invoice.amount);
      }
    });

    return Array.from(customerRevenue.entries())
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [clients, invoices]);

  // Job pipeline data
  const jobPipeline = useMemo(() => {
    const stages: JobStage[] = ['LEAD', 'QUALIFIED', 'PROPOSAL', 'WON', 'IN_PROGRESS', 'COMPLETED', 'PAID'];
    
    return stages.map(stage => {
      const stageJobs = jobs.filter(job => job.stage === stage);
      return {
        stage: stage.replace('_', ' '),
        count: stageJobs.length,
        value: stageJobs.reduce((sum, job) => sum + job.estimated_amount, 0)
      };
    });
  }, [jobs]);

  // Job types analysis
  const jobTypes = useMemo(() => {
    const typeMap = new Map();
    
    jobs.forEach(job => {
      job.tags.forEach(tag => {
        const current = typeMap.get(tag) || { count: 0, revenue: 0 };
        typeMap.set(tag, {
          count: current.count + 1,
          revenue: current.revenue + job.estimated_amount
        });
      });
    });

    const total = jobs.length;
    return Array.from(typeMap.entries())
      .map(([type, data]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        value: Math.round((data.count / total) * 100),
        revenue: data.revenue
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [jobs]);

  // Daily task completion
  const dailyTasks = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const now = new Date();
    
    return days.map((day, index) => {
      const dayDate = new Date(now.getTime() - ((6 - index) * 24 * 60 * 60 * 1000));
      const dayStart = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.updated_at);
        return taskDate >= dayStart && taskDate < dayEnd;
      });
      
      return {
        day,
        completed: dayTasks.filter(task => task.status === 'DONE').length,
        scheduled: dayTasks.length
      };
    });
  }, [tasks]);

  // Cash flow calculation
  const cashFlow = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const incoming = invoices
      .filter(inv => inv.status === 'PAID' && new Date(inv.updated_at) >= startOfMonth)
      .reduce((sum, inv) => sum + inv.amount, 0);
    
    // Mock outgoing expenses (in real app, this would come from expense tracking)
    const outgoing = incoming * 0.65; // Assume 65% expense ratio
    
    return {
      incoming,
      outgoing,
      net: incoming - outgoing
    };
  }, [invoices]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const KPICard = ({ title, value, change, icon: Icon, color, prefix = '' }: {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ComponentType<any>;
    color: string;
    prefix?: string;
  }) => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg p-4 border shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {prefix}{typeof value === 'number' ? formatCurrency(value) : value}
          </p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const AlertBanner = ({ type, message }: { type: 'warning' | 'danger' | 'info'; message: string }) => {
    const alertStyles = {
      warning: `${darkMode ? 'bg-yellow-900/20 border-yellow-600 text-yellow-400' : 'bg-yellow-50 border-yellow-200 text-yellow-800'}`,
      danger: `${darkMode ? 'bg-red-900/20 border-red-600 text-red-400' : 'bg-red-50 border-red-200 text-red-800'}`,
      info: `${darkMode ? 'bg-blue-900/20 border-blue-600 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-800'}`
    };

    return (
      <div className={`rounded-lg border p-3 mb-4 ${alertStyles[type]}`}>
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">{message}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 rounded-md ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className={`ml-2 text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Analytics Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className={`px-3 py-1 text-sm rounded-md border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="services">Services</option>
                <option value="consulting">Consulting</option>
                <option value="development">Development</option>
              </select>

              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className={`px-3 py-1 text-sm rounded-md border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>

              <button className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Alerts */}
        {kpiData.overdueCount > 0 && (
          <AlertBanner 
            type="danger" 
            message={`You have ${kpiData.overdueCount} overdue invoices totaling ${formatCurrency(kpiData.outstandingInvoices)}`} 
          />
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <KPICard
            title="Monthly Revenue"
            value={kpiData.monthlyRevenue}
            change={kpiData.monthlyRevenueChange}
            icon={DollarSign}
            color="bg-green-500"
          />
          <KPICard
            title="Outstanding Invoices"
            value={kpiData.outstandingInvoices}
            icon={FileText}
            color="bg-yellow-500"
            prefix={`${kpiData.overdueCount} overdue / `}
          />
          <KPICard
            title="Active Jobs"
            value={kpiData.activeJobs}
            icon={Briefcase}
            color="bg-blue-500"
          />
          <KPICard
            title="Profit Margin"
            value={`${kpiData.profitMargin.toFixed(1)}%`}
            change={kpiData.profitMarginChange}
            icon={TrendingUp}
            color="bg-purple-500"
          />
          <KPICard
            title="Jobs Completed"
            value={kpiData.jobsCompleted}
            change={kpiData.jobsCompletedChange}
            icon={CheckCircle}
            color="bg-indigo-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Financial Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue Trend */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border shadow-sm p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Revenue Trend (Last 12 Weeks)
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                  <XAxis dataKey="week" stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                  <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                      border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                      color: darkMode ? '#FFFFFF' : '#000000'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Job Pipeline */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border shadow-sm p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Job Pipeline Funnel
              </h3>
              <div className="space-y-3">
                {jobPipeline.map((stage, index) => (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {stage.stage}
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {stage.count} jobs ({formatCurrency(stage.value)})
                      </span>
                    </div>
                    <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-8`}>
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ width: `${Math.max(10, 100 - (index * 15))}%` }}
                      >
                        {stage.count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Cash Flow */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border shadow-sm p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Cash Flow This Month
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Money In</span>
                    <span className="text-green-600 font-semibold">{formatCurrency(cashFlow.incoming)}</span>
                  </div>
                  <div className="w-full bg-green-100 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Money Out</span>
                    <span className="text-red-600 font-semibold">{formatCurrency(cashFlow.outgoing)}</span>
                  </div>
                  <div className="w-full bg-red-100 rounded-full h-3">
                    <div className="bg-red-500 h-3 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div className={`pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Net Cash Flow</span>
                    <span className="text-xl font-bold text-blue-600">{formatCurrency(cashFlow.net)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Customers */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border shadow-sm p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Top 5 Customers
              </h3>
              <div className="space-y-3">
                {topCustomers.length > 0 ? topCustomers.map((customer, index) => (
                  <div key={customer.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {index + 1}.
                      </span>
                      <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {customer.name}
                      </span>
                    </div>
                    <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {formatCurrency(customer.revenue)}
                    </span>
                  </div>
                )) : (
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No customer data available
                  </p>
                )}
              </div>
            </div>

            {/* Job Types */}
            {jobTypes.length > 0 && (
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border shadow-sm p-6`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Revenue by Job Type
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={jobTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, value }) => `${type}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {jobTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                        border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                        color: darkMode ? '#FFFFFF' : '#000000'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Daily Tasks */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border shadow-sm p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Daily Task Completion (This Week)
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dailyTasks}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                  <XAxis dataKey="day" stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                  <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                      border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                      color: darkMode ? '#FFFFFF' : '#000000'
                    }}
                  />
                  <Bar dataKey="completed" fill="#10B981" name="Completed" />
                  <Bar dataKey="scheduled" fill="#9CA3AF" name="Scheduled" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Schedule Utilization */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border shadow-sm p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Task Completion Rate
              </h3>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke={darkMode ? '#374151' : '#E5E7EB'}
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#3B82F6"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56 * 0.78} ${2 * Math.PI * 56}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'DONE').length / tasks.length) * 100) : 0}%
                      </span>
                      <span className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Complete</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {tasks.filter(t => t.status === 'DONE').length} of {tasks.length} tasks completed
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};