import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckSquare,
  Users,
  Briefcase,
  Calendar,
  Activity
} from 'lucide-react';
import { mockDashboardStats, mockTasks, mockActivities } from '../../data/mockCrmData';
import { StageChip } from './StageChip';
import { StatusBadge } from './StatusBadge';
import { MoneyFormatter } from './MoneyFormatter';
import { ActivityFeed } from './ActivityFeed';
import type { JobStage } from '../../types/crm';

interface CRMDashboardProps {
  darkMode: boolean;
}

export const CRMDashboard: React.FC<CRMDashboardProps> = ({ darkMode }) => {
  const stats = mockDashboardStats;
  
  // Get today's and overdue tasks
  const today = new Date();
  const todaysTasks = mockTasks.filter(task => {
    if (!task.due_at || task.status === 'DONE') return false;
    const dueDate = new Date(task.due_at);
    return dueDate.toDateString() === today.toDateString();
  });

  const overdueTasks = mockTasks.filter(task => {
    if (!task.due_at || task.status === 'DONE') return false;
    const dueDate = new Date(task.due_at);
    return dueDate < today;
  });

  const urgentTasks = [...overdueTasks, ...todaysTasks].slice(0, 5);

  const handleStageClick = (stage: JobStage) => {
    // TODO: Navigate to jobs with stage filter
    console.log(`Filter jobs by stage: ${stage}`);
  };

  const handleTaskToggle = (taskId: string) => {
    // TODO: Toggle task completion
    console.log(`Toggle task: ${taskId}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          CRM Dashboard
        </h1>
        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Your business overview at a glance
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Pipeline Value
              </p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <MoneyFormatter amount={stats.total_pipeline_value} />
              </p>
            </div>
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Won This Month
              </p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <MoneyFormatter amount={stats.won_this_month} />
              </p>
            </div>
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Unpaid Invoices
              </p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <MoneyFormatter amount={stats.unpaid_invoices} />
              </p>
            </div>
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <CheckSquare className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Open Tasks
              </p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats.open_tasks}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pipeline Summary */}
        <div className={`lg:col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Sales Pipeline
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Click on a stage to filter jobs
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.jobs_by_stage).map(([stage, count]) => (
                <button
                  key={stage}
                  onClick={() => handleStageClick(stage as JobStage)}
                  className={`p-4 rounded-lg border-2 border-dashed transition-all hover:scale-105 ${
                    darkMode 
                      ? 'border-gray-600 hover:border-blue-500 hover:bg-gray-700' 
                      : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {count}
                    </div>
                    <StageChip stage={stage as JobStage} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Priority Tasks
              </h2>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {urgentTasks.length} items
              </span>
            </div>
          </div>
          
          <div className="p-6">
            {urgentTasks.length > 0 ? (
              <div className="space-y-3">
                {urgentTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border ${
                      darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                    } transition-colors cursor-pointer`}
                  >
                    <button
                      onClick={() => handleTaskToggle(task.id)}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        task.status === 'DONE'
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      {task.status === 'DONE' && (
                        <CheckSquare className="w-3 h-3 text-white" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        task.status === 'DONE' 
                          ? `line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}` 
                          : `${darkMode ? 'text-white' : 'text-gray-900'}`
                      }`}>
                        {task.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <StatusBadge status={task.status} type="task" />
                        {task.due_at && (
                          <span className={`text-xs ${
                            new Date(task.due_at) < today && task.status !== 'DONE'
                              ? 'text-red-500 font-medium'
                              : `${darkMode ? 'text-gray-400' : 'text-gray-500'}`
                          }`}>
                            {new Date(task.due_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckSquare className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No urgent tasks today
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Activity
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <ActivityFeed activities={stats.recent_activities} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
};