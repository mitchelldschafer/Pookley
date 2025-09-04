import React, { useState, useMemo } from 'react';
import { Plus, Filter, Calendar, DollarSign, MapPin, Tag } from 'lucide-react';
import { mockClients } from '../../data/mockCrmData';
import { StageChip } from './StageChip';
import { MoneyFormatter } from './MoneyFormatter';
import { KanbanBoard } from './KanbanBoard';
import { AddJobModal } from './modals/AddJobModal';
import { useJobs } from '../../hooks/useCrmData';
import type { JobStage } from '../../types/crm';

interface CRMJobsProps {
  darkMode: boolean;
  searchTerm: string;
}

export const CRMJobs: React.FC<CRMJobsProps> = ({ darkMode, searchTerm }) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [stageFilter, setStageFilter] = useState<JobStage | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const { jobs, loading, addJob, updateJobStage } = useJobs();

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStage = stageFilter === 'all' || job.stage === stageFilter;
      return matchesSearch && matchesStage;
    });
  }, [jobs, searchTerm, stageFilter]);

  const getClientName = (clientId: string) => {
    return mockClients.find(c => c.id === clientId)?.name || 'Unknown Client';
  };

  const handleStageChange = async (jobId: string, newStage: JobStage) => {
    try {
      await updateJobStage(jobId, newStage);
    } catch (error) {
      console.error('Error updating job stage:', error);
    }
  };

  const handleJobClick = (jobId: string) => {
    // TODO: Navigate to job detail
    console.log(`View job: ${jobId}`);
  };

  const handleAddJob = async (data: CreateJobData) => {
    try {
      await addJob(data);
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  const renderListView = () => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Job
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Client
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Stage
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Value
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Due Date
              </th>
            </tr>
          </thead>
          <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {filteredJobs.map((job) => (
              <tr 
                key={job.id} 
                className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} cursor-pointer`}
                onClick={() => handleJobClick(job.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {job.title}
                    </div>
                    {job.description && (
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate max-w-xs`}>
                        {job.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {getClientName(job.client_id)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StageChip stage={job.stage} />
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  <MoneyFormatter amount={job.estimated_amount} />
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {job.due_date ? new Date(job.due_date).toLocaleDateString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Jobs Pipeline
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Track your deals from lead to completion
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as JobStage | 'all')}
            className={`px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Stages</option>
            <option value="LEAD">Lead</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="PROPOSAL">Proposal</option>
            <option value="WON">Won</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="PAID">Paid</option>
            <option value="LOST">Lost</option>
          </select>

          <div className={`flex rounded-lg border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-blue-600 text-white'
                  : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`
              }`}
            >
              List
            </button>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Job</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'kanban' ? (
        <KanbanBoard 
          jobs={filteredJobs} 
          darkMode={darkMode} 
          onStageChange={handleStageChange}
          onJobClick={handleJobClick}
        />
      ) : (
        renderListView()
      )}

      <AddJobModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddJob}
        darkMode={darkMode}
      />
    </div>
  );
};