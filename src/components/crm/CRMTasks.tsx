import React, { useState, useMemo } from 'react';
import { Plus, Filter, Calendar, AlertTriangle, CheckSquare, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { mockClients, mockJobs } from '../../data/mockCrmData';
import { StatusBadge } from './StatusBadge';
import { AddTaskModal } from './modals/AddTaskModal';
import { useTasks } from '../../hooks/useCrmData';
import type { TaskStatus, TaskPriority } from '../../types/crm';

interface CRMTasksProps {
  darkMode: boolean;
  searchTerm: string;
}

export const CRMTasks: React.FC<CRMTasksProps> = ({ darkMode, searchTerm }) => {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const { tasks, loading, addTask, updateTaskStatus } = useTasks();

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    }).sort((a, b) => {
      // Sort by priority first, then by due date
      const priorityOrder = { 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      if (a.due_at && b.due_at) {
        return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
      }
      
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const getClientName = (clientId?: string) => {
    if (!clientId) return null;
    return mockClients.find(c => c.id === clientId)?.name;
  };

  const getJobTitle = (jobId?: string) => {
    if (!jobId) return null;
    return mockJobs.find(j => j.id === jobId)?.title;
  };

  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case 'URGENT':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'HIGH':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'MEDIUM':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'LOW':
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const isOverdue = (dueAt?: string) => {
    if (!dueAt) return false;
    return new Date(dueAt) < new Date();
  };

  const handleTaskToggle = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newStatus = task.status === 'DONE' ? 'OPEN' : 'DONE';
      await updateTaskStatus(taskId, newStatus);
    }
  };

  const handleTaskClick = (taskId: string) => {
    // TODO: Open task detail/edit modal
    console.log(`Edit task: ${taskId}`);
  };

  const handleAddTask = async (data: CreateTaskData) => {
    try {
      await addTask(data);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Tasks
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage your to-do list and project tasks
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
            className={`px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="BLOCKED">Blocked</option>
            <option value="DONE">Done</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}
            className={`px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Priority</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length > 0 ? (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-6 hover:bg-opacity-50 transition-colors cursor-pointer ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleTaskClick(task.id)}
              >
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTaskToggle(task.id);
                    }}
                    className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      task.status === 'DONE'
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-blue-500 dark:border-gray-600 dark:hover:border-blue-400'
                    }`}
                  >
                    {task.status === 'DONE' && (
                      <CheckSquare className="w-3 h-3 text-white" />
                    )}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-sm font-medium ${
                          task.status === 'DONE' 
                            ? `line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}` 
                            : `${darkMode ? 'text-white' : 'text-gray-900'}`
                        }`}>
                          {task.title}
                        </h3>
                        
                        {task.description && (
                          <p className={`text-sm mt-1 ${
                            task.status === 'DONE' 
                              ? `line-through ${darkMode ? 'text-gray-600' : 'text-gray-500'}` 
                              : `${darkMode ? 'text-gray-400' : 'text-gray-600'}`
                          }`}>
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Priority Icon */}
                      <div className="ml-2">
                        {getPriorityIcon(task.priority)}
                      </div>
                    </div>

                    {/* Task Meta */}
                    <div className="flex items-center space-x-4 mt-3">
                      <StatusBadge status={task.status} type="task" />
                      
                      {task.due_at && (
                        <div className={`flex items-center space-x-1 ${
                          isOverdue(task.due_at) && task.status !== 'DONE'
                            ? 'text-red-500'
                            : `${darkMode ? 'text-gray-400' : 'text-gray-500'}`
                        }`}>
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs">
                            {isOverdue(task.due_at) && task.status !== 'DONE' ? 'Overdue: ' : ''}
                            {formatDistanceToNow(new Date(task.due_at), { addSuffix: true })}
                          </span>
                        </div>
                      )}

                      {getClientName(task.client_id) && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {getClientName(task.client_id)}
                        </span>
                      )}

                      {getJobTitle(task.job_id) && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {getJobTitle(task.job_id)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={`text-center py-12 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg border-2 border-dashed ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
          <CheckSquare className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' ? 'No tasks found' : 'No tasks yet'}
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Try adjusting your filters or search terms.' 
              : 'Get started by creating your first task.'}
          </p>
          {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          )}
        </div>
      )}

      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddTask}
        darkMode={darkMode}
      />
    </div>
  );
};