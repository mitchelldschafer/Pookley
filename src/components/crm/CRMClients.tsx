import React, { useState, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  DollarSign,
  Calendar,
  Eye
} from 'lucide-react';
import { getJobsByClientId, getInvoicesByClientId } from '../../data/mockCrmData';
import { MoneyFormatter } from './MoneyFormatter';
import { AddClientModal } from './modals/AddClientModal';
import { useClients } from '../../hooks/useCrmData';
import type { Client } from '../../types/crm';

interface CRMClientsProps {
  darkMode: boolean;
  searchTerm: string;
}

export const CRMClients: React.FC<CRMClientsProps> = ({ darkMode, searchTerm }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'created_at' | 'total_value'>('name');
  
  const { clients, loading, addClient, updateClient, deleteClient } = useClients();

  const filteredAndSortedClients = useMemo(() => {
    let filtered = clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'total_value':
          return (b.total_value || 0) - (a.total_value || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [clients, searchTerm, sortBy]);

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setShowAddModal(true);
  };

  const handleDeleteClient = async (clientId: string) => {
    if (confirm('Are you sure you want to delete this client? This will also delete all associated jobs and tasks.')) {
      try {
        await deleteClient(clientId);
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  const handleViewClient = (client: Client) => {
    // TODO: Navigate to client detail page
    console.log(`View client: ${client.id}`);
  };

  const handleAddClient = async (data: CreateClientData) => {
    try {
      await addClient(data);
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedClient(null);
  };

  if (loading && clients.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Clients
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage your client relationships
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className={`px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="name">Sort by Name</option>
            <option value="created_at">Sort by Created</option>
            <option value="total_value">Sort by Value</option>
          </select>
          
          <button
            onClick={() => {
              setSelectedClient(null);
              setShowAddModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* Clients Grid */}
      {filteredAndSortedClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedClients.map((client) => (
            <div
              key={client.id}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6 hover:shadow-md transition-all duration-200`}
            >
              {/* Client Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {client.name}
                  </h3>
                  {client.contact_name && (
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {client.contact_name}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-1 ml-2">
                  <button
                    onClick={() => handleViewClient(client)}
                    className={`p-1 rounded hover:bg-opacity-50 transition-colors ${
                      darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditClient(client)}
                    className={`p-1 rounded hover:bg-opacity-50 transition-colors ${
                      darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                    title="Edit Client"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete Client"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                {client.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {client.email}
                    </span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {client.phone}
                    </span>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-start space-x-2">
                    <MapPin className={`w-4 h-4 mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {client.address}
                    </span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Briefcase className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {client.jobs_count || 0}
                    </span>
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Jobs
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <DollarSign className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <MoneyFormatter amount={client.total_value || 0} />
                    </span>
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Value
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {client.last_activity ? formatDistanceToNow(new Date(client.last_activity), { addSuffix: false }) : 'Never'}
                    </span>
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Last Activity
                  </p>
                </div>
              </div>

              {/* Notes Preview */}
              {client.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                    {client.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center py-12 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg border-2 border-dashed ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
          <Users className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {searchTerm ? 'No clients found' : 'No clients yet'}
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
            {searchTerm 
              ? 'Try adjusting your search terms.' 
              : 'Get started by adding your first client.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => {
                setSelectedClient(null);
                setShowAddModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Client</span>
            </button>
          )}
        </div>
      )}

      <AddClientModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSubmit={handleAddClient}
        darkMode={darkMode}
      />
    </div>
  );
};