import React from 'react';
import { ExternalLink, Github, Clock, Zap, Pause, Archive, Star, Lock } from 'lucide-react';
import type { App } from '../types';

interface AppCardProps {
  app: App;
  viewMode: 'grid' | 'list';
  userTier: 'free' | 'pro' | 'premium';
}

export const AppCard: React.FC<AppCardProps> = ({ app, viewMode, userTier }) => {
  const statusConfig = {
    active: { icon: Zap, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30', label: 'Active' },
    development: { icon: Pause, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: 'In Development' },
    archived: { icon: Archive, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-900/30', label: 'Archived' }
  };

  const categoryColors = {
    productivity: 'bg-green-500',
    games: 'bg-purple-500',
    utilities: 'bg-orange-500',
    tools: 'bg-red-500',
    design: 'bg-pink-500',
    security: 'bg-yellow-500',
    lifestyle: 'bg-indigo-500',
    development: 'bg-cyan-500',
  };

  const tierConfig = {
    free: { label: 'Free', color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-800' },
    pro: { label: 'Pro', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    premium: { label: 'Premium', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    enterprise: { label: 'Enterprise', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' }
  };

  const status = statusConfig[app.status];
  const StatusIcon = status.icon;
  const tier = tierConfig[app.tier];

  const hasAccess = userTier === 'premium' || 
                   (userTier === 'pro' && app.tier !== 'premium') || 
                   (userTier === 'free' && app.tier === 'free') ||
                   (userTier === 'premium' && app.tier === 'enterprise');

  if (viewMode === 'list') {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-600 ${!hasAccess ? 'opacity-75' : ''}`}>
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={app.thumbnail}
                alt={app.name}
                className={`w-16 h-16 rounded-lg object-cover ring-2 ring-gray-200 dark:ring-gray-700 ${!hasAccess ? 'filter blur-sm' : ''}`}
              />
              {!hasAccess && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-gray-500" />
                </div>
              )}
              {app.featured && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
                {app.name}
                {!hasAccess && <Lock className="w-4 h-4 text-gray-400 ml-2 inline" />}
              </h3>
              <div className="flex items-center space-x-2 ml-4">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${tier.bg} ${tier.color}`}>
                  {tier.label}
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color} flex items-center space-x-1`}>
                  <StatusIcon className="w-3 h-3" />
                  <span>{status.label}</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
              {app.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {app.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-md text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(app.lastUpdated).toLocaleDateString()}</span>
                </div>
                {app.usage && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>{app.usage} uses</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {app.sourceUrl && (
                  <a
                    href={hasAccess ? app.sourceUrl : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${!hasAccess ? 'cursor-not-allowed opacity-50' : ''}`}
                    title="View Source"
                    onClick={!hasAccess ? (e) => e.preventDefault() : undefined}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => handleLaunchApp(app, hasAccess)}
                  className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center space-x-1 ${!hasAccess ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={!hasAccess}
                >
                  {hasAccess ? <ExternalLink className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  <span>{hasAccess ? 'Launch' : 'Locked'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-600 ${!hasAccess ? 'opacity-75' : ''}`}>
      <div className="relative">
        <img
          src={app.thumbnail}
          alt={app.name}
          className={`w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ${!hasAccess ? 'filter blur-sm' : ''}`}
        />
        {!hasAccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Lock className="w-8 h-8 text-white" />
          </div>
        )}
        {app.featured && (
          <div className="absolute top-3 left-3">
            <div className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full flex items-center space-x-1">
              <Star className="w-3 h-3" />
              <span>FEATURED</span>
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <div className={`w-3 h-3 rounded-full ${categoryColors[app.category]}`}></div>
        </div>
        <div className="absolute top-3 right-3">
          <div className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${tier.bg} ${tier.color} mb-2`}>
            {tier.label}
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${status.bg} ${status.color} flex items-center space-x-1`}>
            <StatusIcon className="w-3 h-3" />
            <span>{status.label}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
          {app.name}
          {!hasAccess && <Lock className="w-4 h-4 text-gray-400 ml-2 inline" />}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {app.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {app.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-md text-xs font-medium"
            >
              {tech}
            </span>
          ))}
          {app.technologies.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md text-xs">
              +{app.technologies.length - 3}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{new Date(app.lastUpdated).toLocaleDateString()}</span>
          </div>
          {app.usage && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4" />
              <span>{app.usage}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {app.sourceUrl && (
            <a
              href={hasAccess ? app.sourceUrl : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center text-sm font-medium flex items-center justify-center space-x-1 ${!hasAccess ? 'cursor-not-allowed opacity-50' : ''}`}
              onClick={!hasAccess ? (e) => e.preventDefault() : undefined}
            >
              <Github className="w-4 h-4" />
              <span>Source</span>
            </a>
          )}
          <button
            onClick={() => handleLaunchApp(app, hasAccess)}
            className={`${app.sourceUrl ? 'flex-1' : 'w-full'} px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center text-sm font-medium flex items-center justify-center space-x-1 ${!hasAccess ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={!hasAccess}
          >
            {hasAccess ? <ExternalLink className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>{hasAccess ? 'Launch' : 'Locked'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};