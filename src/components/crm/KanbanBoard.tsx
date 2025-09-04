import React from 'react';
import { Calendar, DollarSign, MapPin, Tag, Plus } from 'lucide-react';
import { StageChip } from './StageChip';
import { MoneyFormatter } from './MoneyFormatter';
import { mockClients } from '../../data/mockCrmData';
import type { Job, JobStage } from '../../types/crm';

interface KanbanBoardProps {
  jobs: Job[];
  darkMode: boolean;
  onStageChange: (jobId: string, newStage: JobStage) => void;
  onJobClick: (jobId: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  jobs, 
  darkMode, 
  onStageChange, 
  onJobClick 
}) => {
  const stages: JobStage[] = ['LEAD', 'QUALIFIED', 'PROPOSAL', 'WON', 'IN_PROGRESS', 'COMPLETED', 'PAID', 'LOST'];
  
  const getJobsByStage = (stage: JobStage) => {
    return jobs.filter(job => job.stage === stage);
  };

  const getClientName = (clientId: string) => {
    return mockClients.find(c => c.id === clientId)?.name || 'Unknown Client';
  };

  const handleDragStart = (e: React.DragEvent, jobId: string) => {
    e.dataTransfer.setData('text/plain', jobId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stage: JobStage) => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData('text/plain');
    onStageChange(jobId, stage);
  };

  const getStageColor = (stage: JobStage) => {
    const colors = {
      'LEAD': 'border-gray-300 dark:border-gray-600',
      'QUALIFIED': 'border-blue-300 dark:border-blue-600',
      'PROPOSAL': 'border-yellow-300 dark:border-yellow-600',
      'WON': 'border-green-300 dark:border-green-600',
      'IN_PROGRESS': 'border-purple-300 dark:border-purple-600',
      'COMPLETED': 'border-emerald-300 dark:border-emerald-600',
      'PAID': 'border-green-300 dark:border-green-600',
      'LOST': 'border-red-300 dark:border-red-600'
    };
    return colors[stage];
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-4 pb-4" style={{ minWidth: '1200px' }}>
        {stages.map((stage) => {
          const stageJobs = getJobsByStage(stage);
          const stageValue = stageJobs.reduce((sum, job) => sum + job.estimated_amount, 0);
          
          return (
            <div
              key={stage}
              className={`flex-1 min-w-72 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg border-2 ${getStageColor(stage)}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
            >
              {/* Column Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <StageChip stage={stage} />
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {stageJobs.length}
                  </span>
                </div>
                {stageValue > 0 && (
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <MoneyFormatter amount={stageValue} />
                  </div>
                )}
              </div>

              {/* Job Cards */}
              <div className="p-4 space-y-3 min-h-96">
                {stageJobs.map((job) => (
                  <div
                    key={job.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, job.id)}
                    onClick={() => onJobClick(job.id)}
                    className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'} p-4 rounded-lg border ${darkMode ? 'border-gray-600' : 'border-gray-200'} cursor-pointer transition-all duration-200 hover:shadow-md`}
                  >
                    <div className="mb-3">
                      <h4 className={`font-medium text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {job.title}
                      </h4>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {getClientName(job.client_id)}
                      </p>
                    </div>

                    {job.description && (
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3 line-clamp-2`}>
                        {job.description}
                      </p>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <DollarSign className={`w-3 h-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                          <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <MoneyFormatter amount={job.estimated_amount} />
                          </span>
                        </div>
                        
                        {job.due_date && (
                          <div className="flex items-center space-x-1">
                            <Calendar className={`w-3 h-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {new Date(job.due_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {job.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className={`w-3 h-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {job.location}
                          </span>
                        </div>
                      )}

                      {job.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {job.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                darkMode 
                                  ? 'bg-gray-600 text-gray-300' 
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                          {job.tags.length > 3 && (
                            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              +{job.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Job to Stage Button */}
                <button
                  onClick={() => console.log(`Add job to ${stage}`)}
                  className={`w-full p-3 border-2 border-dashed rounded-lg transition-colors ${
                    darkMode 
                      ? 'border-gray-600 text-gray-400 hover:border-blue-500 hover:text-blue-400' 
                      : 'border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-600'
                  }`}
                >
                  <Plus className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};