import React, { useState } from 'react';
import { X, FileText, DollarSign, Calendar } from 'lucide-react';
import { mockClients, mockJobs } from '../../../data/mockCrmData';
import type { CreateInvoiceData } from '../../../types/crm';

interface AddInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInvoiceData) => void;
  darkMode: boolean;
  preselectedClientId?: string;
  preselectedJobId?: string;
}

export const AddInvoiceModal: React.FC<AddInvoiceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  darkMode,
  preselectedClientId,
  preselectedJobId
}) => {
  const [formData, setFormData] = useState<CreateInvoiceData>({
    client_id: preselectedClientId || '',
    job_id: preselectedJobId,
    amount: 0,
    due_at: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.client_id) {
      newErrors.client_id = 'Please select a client';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit(formData);
    
    // Reset form
    setFormData({
      client_id: preselectedClientId || '',
      job_id: preselectedJobId,
      amount: 0,
      due_at: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getQuickDueDates = () => {
    const today = new Date();
    return [
      { label: 'Net 15', days: 15 },
      { label: 'Net 30', days: 30 },
      { label: 'Net 60', days: 60 },
      { label: 'Net 90', days: 90 }
    ].map(({ label, days }) => ({
      label,
      value: new Date(today.getTime() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl w-full max-w-lg shadow-2xl`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Create New Invoice
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Client *
            </label>
            <select
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } ${errors.client_id ? 'border-red-500' : ''}`}
            >
              <option value="">Select a client</option>
              {mockClients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            {errors.client_id && (
              <p className="text-red-500 text-sm mt-1">{errors.client_id}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Related Job (Optional)
            </label>
            <select
              name="job_id"
              value={formData.job_id || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">No specific job</option>
              {mockJobs
                .filter(job => !formData.client_id || job.client_id === formData.client_id)
                .map(job => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Amount *
            </label>
            <div className="relative">
              <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } ${errors.amount ? 'border-red-500' : ''}`}
                placeholder="5000.00"
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Due Date
            </label>
            <input
              type="date"
              name="due_at"
              value={formData.due_at}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            
            {/* Quick Due Date Buttons */}
            <div className="flex flex-wrap gap-2 mt-2">
              {getQuickDueDates().map(({ label, value }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, due_at: value }))}
                  className={`px-2 py-1 text-xs rounded border transition-colors ${
                    darkMode 
                      ? 'border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white' 
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Payment terms, project details, etc..."
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 border rounded-lg transition-colors ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};