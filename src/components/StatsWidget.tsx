import React from 'react';
import { Zap, Code, TrendingUp, Calendar, Award, Target } from 'lucide-react';
import type { App } from '../types';

interface StatsWidgetProps {
  apps: App[];
  userTier: 'free' | 'pro' | 'premium';
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({ apps, userTier }) => {
  const totalApps = apps.length;
  const activeApps = apps.filter(app => app.status === 'active').length;
  const inDevelopment = apps.filter(app => app.status === 'development').length;
  const totalUsage = apps.reduce((sum, app) => sum + (app.usage || 0), 0);
  const accessibleApps = apps.filter(app => 
    userTier === 'premium' || 
    (userTier === 'pro' && app.tier !== 'premium') || 
    (userTier === 'free' && app.tier === 'free')
  ).length;
  
  const uniqueTechnologies = Array.from(
    new Set(apps.flatMap(app => app.technologies))
  ).length;
  
  const mostUsedApp = apps.reduce((prev, current) => 
    (current.usage || 0) > (prev.usage || 0) ? current : prev
  );
  
  const recentlyUpdated = apps.filter(app => {
    const appDate = new Date(app.lastUpdated);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return appDate > oneWeekAgo;
  }).length;

  const stats = [
    {
      label: 'Total Apps',
      value: totalApps,
      icon: Code,
      color: 'bg-blue-500',
      change: '+2 this month'
    },
    {
      label: 'Available to You',
      value: accessibleApps,
      icon: Zap,
      color: 'bg-green-500',
      change: `${Math.round((accessibleApps / totalApps) * 100)}% of total`
    },
    {
      label: 'Technologies Used',
      value: uniqueTechnologies,
      icon: Target,
      color: 'bg-purple-500',
      change: 'Diverse stack'
    },
    {
      label: 'Total Usage',
      value: totalUsage.toLocaleString(),
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: 'All time'
    },
    {
      label: 'In Development',
      value: inDevelopment,
      icon: Calendar,
      color: 'bg-yellow-500',
      change: 'Active work'
    },
    {
      label: 'Most Popular',
      value: mostUsedApp.name,
      icon: Award,
      color: 'bg-pink-500',
      change: `${mostUsedApp.usage} uses`,
      isText: true
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="space-y-1">
              <p className={`${stat.isText ? 'text-sm' : 'text-2xl'} font-bold text-gray-900 dark:text-gray-100 ${stat.isText ? 'truncate' : ''}`}>
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {stat.label}
              </p>
              <p className="text-xs text-blue-500 font-medium">
                {stat.change}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};