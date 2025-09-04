import React from 'react';
import type { TaskStatus, InvoiceStatus } from '../../types/crm';

interface StatusBadgeProps {
  status: TaskStatus | InvoiceStatus;
  type: 'task' | 'invoice';
  onClick?: () => void;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type, onClick, className = '' }) => {
  const getConfig = () => {
    if (type === 'task') {
      const taskConfig = {
        'OPEN': { 
          label: 'Open', 
          color: 'bg-gray-100 text-gray-800',
          darkColor: 'dark:bg-gray-700 dark:text-gray-300'
        },
        'IN_PROGRESS': { 
          label: 'In Progress', 
          color: 'bg-blue-100 text-blue-800',
          darkColor: 'dark:bg-blue-900/30 dark:text-blue-300'
        },
        'BLOCKED': { 
          label: 'Blocked', 
          color: 'bg-red-100 text-red-800',
          darkColor: 'dark:bg-red-900/30 dark:text-red-300'
        },
        'DONE': { 
          label: 'Done', 
          color: 'bg-green-100 text-green-800',
          darkColor: 'dark:bg-green-900/30 dark:text-green-300'
        }
      };
      return taskConfig[status as TaskStatus];
    } else {
      const invoiceConfig = {
        'DRAFT': { 
          label: 'Draft', 
          color: 'bg-gray-100 text-gray-800',
          darkColor: 'dark:bg-gray-700 dark:text-gray-300'
        },
        'SENT': { 
          label: 'Sent', 
          color: 'bg-blue-100 text-blue-800',
          darkColor: 'dark:bg-blue-900/30 dark:text-blue-300'
        },
        'PARTIALLY_PAID': { 
          label: 'Partial', 
          color: 'bg-yellow-100 text-yellow-800',
          darkColor: 'dark:bg-yellow-900/30 dark:text-yellow-300'
        },
        'PAID': { 
          label: 'Paid', 
          color: 'bg-green-100 text-green-800',
          darkColor: 'dark:bg-green-900/30 dark:text-green-300'
        },
        'VOID': { 
          label: 'Void', 
          color: 'bg-red-100 text-red-800',
          darkColor: 'dark:bg-red-900/30 dark:text-red-300'
        }
      };
      return invoiceConfig[status as InvoiceStatus];
    }
  };

  const config = getConfig();

  return (
    <span
      onClick={onClick}
      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color} ${config.darkColor} ${
        onClick ? 'cursor-pointer hover:opacity-80' : ''
      } ${className}`}
    >
      {config.label}
    </span>
  );
};