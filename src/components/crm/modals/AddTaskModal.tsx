import React, { useState } from 'react';
import { X, CheckSquare, AlertTriangle, Calendar, Briefcase, User } from 'lucide-react';
import { mockClients, mockJobs } from '../../../data/mockCrmData';
import type { CreateTaskData, TaskPriority } from '../../../types/crm';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskData) => void;
  darkMode: boolean;
  preselectedJobId?: string;
  preselectedClientId?: string;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  darkMode,
  preselectedJobId,
  preselectedClientId
}) => {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    job_id: preselectedJobId,
    client_id: preselectedClientId,
    priority: 'MEDIUM',
    due_at: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (!formData.job_id && !formData.client_id) {
      newErrors.client_id = 'Please select either a job or client';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData = {
      ...formData,
      due_at: formData.due_at || undefined
    };

    onSubmit(submitData);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      job_id: preselectedJobId,
      client_id: preselectedClientId,
      priority: 'MEDIUM',
      due_at: ''
    });
    setErrors({});
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600';
      case 'HIGH': return 'text-orange-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'LOW': return 'text-gray-600';
    }
  };

  const getQuickDueDates = () => {
    const today = new Date();
    return [
      { label: 'Today', value: today.toISOString().split('T')[0] },
      { label: 'Tomorrow', value: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      { label: 'Next Week', value: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      { label: 'Next Month', value: new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()).toISOString().split('T')[0] }
    ];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl w-full max-w-lg shadow-2xl`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-white" />
              </div>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Add New Task
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
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Follow up with client about proposal"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Additional details about this task..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Related Job
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
                {mockJobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Client
              </label>
              <select
                name="client_id"
                value={formData.client_id || ''}
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
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="LOW">Low Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="HIGH">High Priority</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Due Date
            </label>
            <input
              type="datetime-local"
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
                  onClick={() => setFormData(prev => ({ ...prev, due_at: value + 'T17:00' }))}
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
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};