import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Briefcase, 
  CheckSquare, 
  FileText, 
  Settings,
  ArrowLeft,
  Search,
  Plus,
  Bell
} from 'lucide-react';
import { CRMDashboard } from './crm/CRMDashboard';
import { CRMClients } from './crm/CRMClients';
import { CRMJobs } from './crm/CRMJobs';
import { CRMTasks } from './crm/CRMTasks';
import { CRMInvoices } from './crm/CRMInvoices';
import { CRMSettings } from './crm/CRMSettings';
import { ServiceAnalyticsDashboard } from './crm/ServiceAnalyticsDashboard';
import { QuickAddSheet } from './crm/modals/QuickAddSheet';
import { AddClientModal } from './crm/modals/AddClientModal';
import { AddJobModal } from './crm/modals/AddJobModal';
import { AddTaskModal } from './crm/modals/AddTaskModal';
import { AddInvoiceModal } from './crm/modals/AddInvoiceModal';
import { useClients, useJobs, useTasks, useInvoices } from '../hooks/useCrmData';
import type { CreateClientData, CreateJobData, CreateTaskData, CreateInvoiceData } from '../types/crm';

interface CRMAppProps {
  darkMode: boolean;
  onBackToDashboard: () => void;
}

export const CRMApp: React.FC<CRMAppProps> = ({ darkMode, onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'jobs' | 'tasks' | 'invoices' | 'analytics' | 'settings'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  
  // Data hooks
  const { addClient } = useClients();
  const { addJob } = useJobs();
  const { addTask } = useTasks();
  const { addInvoice } = useInvoices();

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'clients', name: 'Clients', icon: Users },
    { id: 'jobs', name: 'Jobs', icon: Briefcase },
    { id: 'tasks', name: 'Tasks', icon: CheckSquare },
    { id: 'invoices', name: 'Invoices', icon: FileText },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const handleQuickAdd = (type: 'client' | 'job' | 'task' | 'invoice') => {
    setShowQuickAdd(false);
    
    switch (type) {
      case 'client':
        setShowClientModal(true);
        break;
      case 'job':
        setShowJobModal(true);
        break;
      case 'task':
        setShowTaskModal(true);
        break;
      case 'invoice':
        setShowInvoiceModal(true);
        break;
    }
  };

  const handleAddClient = async (data: CreateClientData) => {
    try {
      await addClient(data);
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  const handleAddJob = async (data: CreateJobData) => {
    try {
      await addJob(data);
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  const handleAddTask = async (data: CreateTaskData) => {
    try {
      await addTask(data);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleAddInvoice = async (data: CreateInvoiceData) => {
    try {
      await addInvoice(data);
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <CRMDashboard darkMode={darkMode} />;
      case 'clients':
        return <CRMClients darkMode={darkMode} searchTerm={searchTerm} />;
      case 'jobs':
        return <CRMJobs darkMode={darkMode} searchTerm={searchTerm} />;
      case 'tasks':
        return <CRMTasks darkMode={darkMode} searchTerm={searchTerm} />;
      case 'invoices':
        return <CRMInvoices darkMode={darkMode} searchTerm={searchTerm} />;
      case 'analytics':
        return <ServiceAnalyticsDashboard darkMode={darkMode} />;
      case 'settings':
        return <CRMSettings darkMode={darkMode} />;
      default:
        return <CRMDashboard darkMode={darkMode} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToDashboard}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors duration-200 ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>

              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-blue-600' : 'bg-blue-600'
                }`}>
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  CRM
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Global Search */}
              <div className="relative hidden md:block">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  darkMode ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  placeholder="Search clients, jobs, tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-64 pl-9 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              {/* Quick Add Button */}
              <div className="relative">
                <button
                  onClick={() => setShowQuickAdd(!showQuickAdd)}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200"
                  title="Quick Add"
                >
                  <Plus className="w-5 h-5" />
                </button>

                {showQuickAdd && (
                  <div className={`absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg z-50 ${
                    darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}>
                    <div className="py-2">
                      {[
                        { type: 'client', label: 'New Client', icon: Users },
                        { type: 'job', label: 'New Job', icon: Briefcase },
                        { type: 'task', label: 'New Task', icon: CheckSquare },
                        { type: 'invoice', label: 'New Invoice', icon: FileText }
                      ].map(({ type, label, icon: Icon }) => (
                        <button
                          key={type}
                          onClick={() => handleQuickAdd(type as any)}
                          className={`w-full px-4 py-2 text-left transition-colors duration-200 flex items-center space-x-3 ${
                            darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <button
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className={`w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} hidden md:block`}>
          <nav className="mt-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? `${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-700'} border-r-2 border-blue-700`
                      : `${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <main className="p-4 md:p-8">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
        <div className="flex items-center justify-around py-2">
          {navigation.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex flex-col items-center py-2 px-3 transition-colors ${
                  isActive
                    ? 'text-blue-600'
                    : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <QuickAddSheet
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onAddClient={() => handleQuickAdd('client')}
        onAddJob={() => handleQuickAdd('job')}
        onAddTask={() => handleQuickAdd('task')}
        onAddInvoice={() => handleQuickAdd('invoice')}
        darkMode={darkMode}
      />

      <AddClientModal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        onSubmit={handleAddClient}
        darkMode={darkMode}
      />

      <AddJobModal
        isOpen={showJobModal}
        onClose={() => setShowJobModal(false)}
        onSubmit={handleAddJob}
        darkMode={darkMode}
      />

      <AddTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={handleAddTask}
        darkMode={darkMode}
      />

      <AddInvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        onSubmit={handleAddInvoice}
        darkMode={darkMode}
      />

      {/* Click outside to close quick add */}
      {showQuickAdd && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowQuickAdd(false)}
        />
      )}
    </div>
  );
};