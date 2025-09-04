import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  MessageSquare, 
  ArrowRight, 
  Upload, 
  FileText, 
  User, 
  Briefcase, 
  CheckSquare 
} from 'lucide-react';
import type { Activity } from '../../types/crm';

interface ActivityFeedProps {
  activities: Activity[];
  darkMode: boolean;
  limit?: number;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  activities, 
  darkMode, 
  limit 
}) => {
  const displayActivities = limit ? activities.slice(0, limit) : activities;

  const getActivityIcon = (type: string, entityType: string) => {
    switch (type) {
      case 'note':
        return MessageSquare;
      case 'status_change':
        return ArrowRight;
      case 'file_upload':
        return Upload;
      case 'invoice_status':
        return FileText;
      default:
        switch (entityType) {
          case 'client':
            return User;
          case 'job':
            return Briefcase;
          case 'task':
            return CheckSquare;
          case 'invoice':
            return FileText;
          default:
            return MessageSquare;
        }
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'note':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'status_change':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'file_upload':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'invoice_status':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  if (displayActivities.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No recent activity
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayActivities.map((activity) => {
        const Icon = getActivityIcon(activity.type, activity.entity_type);
        const colorClass = getActivityColor(activity.type);
        
        return (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
              <Icon className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                {activity.message}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                }`}>
                  {activity.entity_type}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};