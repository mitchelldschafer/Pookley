import React, { useState, useMemo } from 'react';
import { Plus, Search, Eye, Download, Send, DollarSign, Calendar } from 'lucide-react';
import { mockClients, mockJobs } from '../../data/mockCrmData';
import { StatusBadge } from './StatusBadge';
import { MoneyFormatter } from './MoneyFormatter';
import { AddInvoiceModal } from './modals/AddInvoiceModal';
import { useInvoices } from '../../hooks/useCrmData';
import type { InvoiceStatus } from '../../types/crm';

interface CRMInvoicesProps {
  darkMode: boolean;
  searchTerm: string;
}

export const CRMInvoices: React.FC<CRMInvoicesProps> = ({ darkMode, searchTerm }) => {
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'due_at' | 'amount'>('created_at');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const { invoices, loading, addInvoice, updateInvoiceStatus } = useInvoices();

  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      const client = mockClients.find(c => c.id === invoice.client_id);
      const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          invoice.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'due_at':
          if (!a.due_at && !b.due_at) return 0;
          if (!a.due_at) return 1;
          if (!b.due_at) return -1;
          return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
        case 'amount':
          return b.amount - a.amount;
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }, [invoices, searchTerm, statusFilter, sortBy]);

  const getClientName = (clientId: string) => {
    return mockClients.find(c => c.id === clientId)?.name || 'Unknown Client';
  };

  const getJobTitle = (jobId?: string) => {
    if (!jobId) return null;
    return mockJobs.find(j => j.id === jobId)?.title;
  };

  const isOverdue = (dueAt?: string, status?: InvoiceStatus) => {
    if (!dueAt || status === 'PAID' || status === 'VOID') return false;
    return new Date(dueAt) < new Date();
  };

  const handleInvoiceAction = async (action: string, invoiceId: string) => {
    if (action === 'send') {
      await updateInvoiceStatus(invoiceId, 'SENT');
    } else {
      console.log(`${action} invoice: ${invoiceId}`);
    }
  };

  const totalUnpaid = filteredInvoices
    .filter(inv => !['PAID', 'VOID'].includes(inv.status))
    .reduce((sum, inv) => sum + inv.amount, 0);

  const overdueCount = filteredInvoices
    .filter(inv => isOverdue(inv.due_at, inv.status))
    .length;

  const handleAddInvoice = async (data: CreateInvoiceData) => {
    try {
      await addInvoice(data);
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Invoices
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Track payments and billing
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as InvoiceStatus | 'all')}
            className={`px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
            <option value="PARTIALLY_PAID">Partially Paid</option>
            <option value="PAID">Paid</option>
            <option value="VOID">Void</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className={`px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="created_at">Sort by Created</option>
            <option value="due_at">Sort by Due Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Invoice</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Unpaid Total
              </p>
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <MoneyFormatter amount={totalUnpaid} />
              </p>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Calendar className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Overdue
              </p>
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {overdueCount}
              </p>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Total Invoices
              </p>
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {filteredInvoices.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      {filteredInvoices.length > 0 ? (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Invoice
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Client
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Amount
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Status
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Due Date
                  </th>
                  <th className={`px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {invoice.number}
                        </div>
                        {getJobTitle(invoice.job_id) && (
                          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {getJobTitle(invoice.job_id)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {getClientName(invoice.client_id)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      <MoneyFormatter amount={invoice.amount} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={invoice.status} type="invoice" />
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      <div className={isOverdue(invoice.due_at, invoice.status) ? 'text-red-600 font-medium' : ''}>
                        {invoice.due_at ? new Date(invoice.due_at).toLocaleDateString() : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleInvoiceAction('view', invoice.id)}
                          className="text-blue-600 hover:text-blue-700 p-1 rounded"
                          title="View Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleInvoiceAction('download', invoice.id)}
                          className="text-green-600 hover:text-green-700 p-1 rounded"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {invoice.status === 'DRAFT' && (
                          <button
                            onClick={() => handleInvoiceAction('send', invoice.id)}
                            className="text-purple-600 hover:text-purple-700 p-1 rounded"
                            title="Send Invoice"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className={`text-center py-12 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg border-2 border-dashed ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
          <DollarSign className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {searchTerm || statusFilter !== 'all' ? 'No invoices found' : 'No invoices yet'}
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your filters or search terms.' 
              : 'Create your first invoice to start tracking payments.'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Invoice</span>
            </button>
          )}
        </div>
      )}

      <AddInvoiceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddInvoice}
        darkMode={darkMode}
      />
    </div>
  );
};