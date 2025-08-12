import React, { useState } from 'react';
import { X, Plus, Link, Github } from 'lucide-react';
import type { App, Category } from '../types';

interface AddAppModalProps {
  onClose: () => void;
  onSubmit: (app: Omit<App, 'id'>) => void;
}

export const AddAppModal: React.FC<AddAppModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    technologies: '',
    category: 'tools' as Category,
    status: 'development' as 'active' | 'development' | 'archived',
    liveUrl: '',
    sourceUrl: '',
    thumbnail: ''
  });

  const categories: { value: Category; label: string }[] = [
    { value: 'productivity', label: 'Productivity' },
    { value: 'games', label: 'Games' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'tools', label: 'Tools' },
    { value: 'design', label: 'Design' },
    { value: 'security', label: 'Security' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'development', label: 'Development' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const app: Omit<App, 'id'> = {
      ...formData,
      technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(Boolean),
      lastUpdated: new Date().toISOString().split('T')[0],
      thumbnail: formData.thumbnail || 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=400',
      usage: 0
    };
    
    onSubmit(app);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Add New App
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                App Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="My Awesome App"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="A brief description of what your app does..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Technologies *
            </label>
            <input
              type="text"
              name="technologies"
              required
              value={formData.technologies}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="React, TypeScript, Tailwind CSS"
              title="Separate technologies with commas"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Separate technologies with commas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status *
            </label>
            <select
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="development">In Development</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Link className="w-4 h-4" />
                  <span>Live URL *</span>
                </div>
              </label>
              <input
                type="url"
                name="liveUrl"
                required
                value={formData.liveUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://myapp.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Github className="w-4 h-4" />
                  <span>Source URL</span>
                </div>
              </label>
              <input
                type="url"
                name="sourceUrl"
                value={formData.sourceUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://github.com/user/repo"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Thumbnail URL
            </label>
            <input
              type="url"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Leave empty to use a default placeholder
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              Add App
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};