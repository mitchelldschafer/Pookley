import React from 'react';
import type { JobStage } from '../../types/crm';

interface StageChipProps {
  stage: JobStage;
  onClick?: () => void;
  className?: string;
}

export const StageChip: React.FC<StageChipProps> = ({ stage, onClick, className = '' }) => {
  const stageConfig = {
    'LEAD': { 
      label: 'Lead', 
      color: 'bg-gray-100 text-gray-800 border-gray-300',
      darkColor: 'dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
    },
    'QUALIFIED': { 
      label: 'Qualified', 
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      darkColor: 'dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-600'
    },
    'PROPOSAL': { 
      label: 'Proposal', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      darkColor: 'dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-600'
    },
    'WON': { 
      label: 'Won', 
      color: 'bg-green-100 text-green-800 border-green-300',
      darkColor: 'dark:bg-green-900/30 dark:text-green-300 dark:border-green-600'
    },
    'IN_PROGRESS': { 
      label: 'In Progress', 
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      darkColor: 'dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-600'
    },
    'COMPLETED': { 
      label: 'Completed', 
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      darkColor: 'dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-600'
    },
    'PAID': { 
      label: 'Paid', 
      color: 'bg-green-100 text-green-800 border-green-300',
      darkColor: 'dark:bg-green-900/30 dark:text-green-300 dark:border-green-600'
    },
    'LOST': { 
      label: 'Lost', 
      color: 'bg-red-100 text-red-800 border-red-300',
      darkColor: 'dark:bg-red-900/30 dark:text-red-300 dark:border-red-600'
    }
  };

  const config = stageConfig[stage];

  return (
    <span
      onClick={onClick}
      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${config.color} ${config.darkColor} ${
        onClick ? 'cursor-pointer hover:opacity-80' : ''
      } ${className}`}
    >
      {config.label}
    </span>
  );
};