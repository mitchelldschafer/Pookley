import React from 'react';
import { X, User, Briefcase, CheckSquare, FileText } from 'lucide-react';

interface QuickAddSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: () => void;
  onAddJob: () => void;
  onAddTask: () => void;
  onAddInvoice: () => void;
  darkMode: boolean;
}

export const QuickAddSheet: React.FC<QuickAddSheetProps> = ({
  isOpen,
  onClose,
  onAddClient,
  onAddJob,
  onAddTask,
  onAddInvoice,
  darkMode
}) => {
  if (!isOpen) return null;

  const quickActions = [
    {
      label: 'New Client',
      icon: User,
      action: onAddClient,
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'Add a new client or company'
    },
    {
      label: 'New Job',
      icon: Briefcase,
      action: onAddJob,
      color: 'bg-green-600 hover:bg-green-700',
      description: 'Create a new project or deal'
    },
    {
      label: 'New Task',
      icon: CheckSquare,
      action: onAddTask,
      color: 'bg-purple-600 hover:bg-purple-700',
      description: 'Add a task or reminder'
    },
    {
      label: 'New Invoice',
      icon: FileText,
      action: onAddInvoice,
      color: 'bg-yellow-600 hover:bg-yellow-700',
      description: 'Create an invoice for payment'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center p-4 z-50 md:items-center">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-t-2xl md:rounded-2xl w-full max-w-md shadow-2xl`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Quick Add
            </h2>
            <button
              onClick={onClose}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Choose what you'd like to create
          </p>
        </div>

        <div className="p-6 space-y-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => {
                  action.action();
                  onClose();
                }}
                className={`w-full p-4 ${action.color} text-white rounded-lg transition-all duration-200 hover:scale-105 flex items-center space-x-4`}
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-medium">{action.label}</div>
                  <div className="text-sm opacity-90">{action.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};