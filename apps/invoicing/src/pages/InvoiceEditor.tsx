import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, Send, Download, CreditCard, Eye, X } from 'lucide-react';
import { Button, Input } from '@pookley/ui';
import { useInvoice, useCreateInvoice, useUpdateInvoiceStatus } from '../hooks/useInvoices';
import { useCustomers } from '../hooks/useCustomers';
import { useInvoiceItems, useCreateInvoiceItem, useUpdateInvoiceItem, useDeleteInvoiceItem } from '../hooks/useInvoiceItems';
import { formatCurrency, parseCurrency, centsToDollars } from '../utils/currency';
import { generateInvoicePDF } from '../utils/pdf';
import type { CreateInvoiceItemData } from '../types';

export const InvoiceEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [newInvoiceData, setNewInvoiceData] = useState({
    customer_id: '',
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    tax_percent: 0,
    notes: ''
  });

  const [newItem, setNewItem] = useState<CreateInvoiceItemData>({
    description: '',
    quantity: 1,
    unit_price_cents: 0
  });

  const { data: invoice, isLoading: invoiceLoading } = useInvoice(id || '');
  const { data: customers } = useCustomers();
  const { data: items } = useInvoiceItems(id || '');
  
  const createInvoice = useCreateInvoice();
  const updateInvoiceStatus = useUpdateInvoiceStatus();
  const createItem = useCreateInvoiceItem();
  const updateItem = useUpdateInvoiceItem();
  const deleteItem = useDeleteInvoiceItem();

  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isNew && createInvoice.isSuccess && createInvoice.data) {
      navigate(`/invoicing/invoices/${createInvoice.data.id}`, { replace: true });
    }
  }, [createInvoice.isSuccess, createInvoice.data, navigate, isNew]);

  const handleCreateInvoice = async () => {
    if (!newInvoiceData.customer_id) return;
    
    setIsCreating(true);
    try {
      await createInvoice.mutateAsync(newInvoiceData);
    } catch (error) {
      console.error('Error creating invoice:', error);
      setIsCreating(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.description.trim() || !id) return;

    try {
      await createItem.mutateAsync({
        ...newItem,
        invoice_id: id
      });
      
      setNewItem({
        description: '',
        quantity: 1,
        unit_price_cents: 0
      });
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!id) return;
    
    try {
      await deleteItem.mutateAsync({ id: itemId, invoice_id: id });
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleSendInvoice = async () => {
    if (!id) return;
    
    try {
      // Call API stub to send invoice
      const response = await fetch('/api/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: id })
      });
      
      if (response.ok) {
        await updateInvoiceStatus.mutateAsync({
          id,
          status: 'sent'
        });
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
    }
  };

  const handleGeneratePaymentLink = async () => {
    if (!id) return;
    
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: id })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        await updateInvoiceStatus.mutateAsync({
          id,
          status: invoice?.status || 'sent',
          metadata: {
            stripe_checkout_session_id: data.sessionId,
            stripe_checkout_url: data.url
          }
        });
        
        // Open payment link in new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error generating payment link:', error);
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoice) return;
    
    try {
      const pdfBlob = await generateInvoicePDF(invoice);
      const url = URL.createObjectURL(pdfBlob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice.invoice_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const calculateTotals = () => {
    if (!items) return { subtotal: 0, tax: 0, total: 0 };
    
    const subtotal = items.reduce((sum, item) => sum + item.total_cents, 0);
    const tax = Math.round(subtotal * (invoice?.tax_percent || 0) / 100);
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  if (isNew) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Invoice</h1>
              <p className="text-gray-600">Fill in the details to create a new invoice</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/invoicing/invoices')}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer *
                </label>
                <select
                  value={newInvoiceData.customer_id}
                  onChange={(e) => setNewInvoiceData(prev => ({ ...prev, customer_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a customer</option>
                  {customers?.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} ({customer.email})
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Due Date"
                type="date"
                value={newInvoiceData.due_date}
                onChange={(e) => setNewInvoiceData(prev => ({ ...prev, due_date: e.target.value }))}
                required
              />
            </div>

            <Input
              label="Tax Percentage"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={newInvoiceData.tax_percent}
              onChange={(e) => setNewInvoiceData(prev => ({ ...prev, tax_percent: parseFloat(e.target.value) || 0 }))}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={newInvoiceData.notes}
                onChange={(e) => setNewInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add any notes or terms..."
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleCreateInvoice}
                loading={isCreating}
                disabled={!newInvoiceData.customer_id}
              >
                Create Invoice
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (invoiceLoading || !invoice) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Invoice {invoice.invoice_number}
            </h1>
            <p className="text-gray-600">
              Created {new Date(invoice.created_at).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {invoice.status === 'draft' && (
              <Button variant="outline" onClick={handleSendInvoice}>
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            )}
            
            {['sent', 'viewed'].includes(invoice.status) && (
              <Button variant="outline" onClick={handleGeneratePaymentLink}>
                <CreditCard className="w-4 h-4 mr-2" />
                Get Payment Link
              </Button>
            )}
            
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Bill To</h3>
            <div className="text-gray-600">
              <p className="font-medium">{invoice.customer?.name}</p>
              <p>{invoice.customer?.email}</p>
              {invoice.customer?.phone && <p>{invoice.customer.phone}</p>}
              {invoice.customer?.address && <p>{invoice.customer.address}</p>}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Invoice Details</h3>
            <div className="text-gray-600 space-y-1">
              <p><span className="font-medium">Status:</span> {invoice.status}</p>
              <p><span className="font-medium">Due Date:</span> {new Date(invoice.due_date).toLocaleDateString()}</p>
              <p><span className="font-medium">Tax Rate:</span> {invoice.tax_percent}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium text-gray-900">Line Items</h2>
        </div>
        
        <div className="p-6">
          {items && items.length > 0 && (
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-sm font-medium text-gray-500">Description</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-500 w-20">Qty</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-500 w-24">Price</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-500 w-24">Total</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3 text-sm text-gray-900">{item.description}</td>
                      <td className="py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                      <td className="py-3 text-sm text-gray-900 text-right">
                        {formatCurrency(item.unit_price_cents)}
                      </td>
                      <td className="py-3 text-sm text-gray-900 text-right">
                        {formatCurrency(item.total_cents)}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Add new item */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Add Line Item</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Description"
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Qty"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Price"
                  step="0.01"
                  min="0"
                  value={centsToDollars(newItem.unit_price_cents)}
                  onChange={(e) => setNewItem(prev => ({ ...prev, unit_price_cents: parseCurrency(e.target.value) }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleAddItem}
                  disabled={!newItem.description.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Totals */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax ({invoice.tax_percent}%):</span>
              <span className="text-gray-900">{formatCurrency(tax)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between text-lg font-medium">
                <span className="text-gray-900">Total:</span>
                <span className="text-gray-900">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Notes</h3>
            <p className="text-sm text-gray-600">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};