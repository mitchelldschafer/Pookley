import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Customers } from './pages/Customers';
import { Invoices } from './pages/Invoices';
import { InvoiceEditor } from './pages/InvoiceEditor';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/invoicing" replace />} />
        <Route path="/invoicing" element={<Dashboard />} />
        <Route path="/invoicing/customers" element={<Customers />} />
        <Route path="/invoicing/invoices" element={<Invoices />} />
        <Route path="/invoicing/invoices/:id" element={<InvoiceEditor />} />
      </Routes>
    </Layout>
  );
}

export default App;