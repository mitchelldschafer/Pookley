import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Invoice } from '../types';
import { formatCurrency } from './currency';

export const generateInvoicePDF = async (invoice: Invoice): Promise<Blob> => {
  const pdf = new jsPDF();
  
  // Header
  pdf.setFontSize(24);
  pdf.text('INVOICE', 20, 30);
  
  pdf.setFontSize(12);
  pdf.text(`Invoice #${invoice.invoice_number}`, 20, 45);
  pdf.text(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`, 20, 55);
  pdf.text(`Due Date: ${new Date(invoice.due_date).toLocaleDateString()}`, 20, 65);
  
  // Customer info
  pdf.setFontSize(14);
  pdf.text('Bill To:', 20, 85);
  pdf.setFontSize(12);
  if (invoice.customer) {
    pdf.text(invoice.customer.name, 20, 95);
    pdf.text(invoice.customer.email, 20, 105);
    if (invoice.customer.address) {
      pdf.text(invoice.customer.address, 20, 115);
    }
  }
  
  // Items table
  let yPos = 140;
  pdf.setFontSize(12);
  pdf.text('Description', 20, yPos);
  pdf.text('Qty', 120, yPos);
  pdf.text('Price', 140, yPos);
  pdf.text('Total', 170, yPos);
  
  yPos += 10;
  pdf.line(20, yPos, 190, yPos);
  yPos += 10;
  
  if (invoice.items) {
    invoice.items.forEach((item) => {
      pdf.text(item.description, 20, yPos);
      pdf.text(item.quantity.toString(), 120, yPos);
      pdf.text(formatCurrency(item.unit_price_cents), 140, yPos);
      pdf.text(formatCurrency(item.total_cents), 170, yPos);
      yPos += 10;
    });
  }
  
  // Totals
  yPos += 10;
  pdf.text(`Subtotal: ${formatCurrency(invoice.subtotal_cents)}`, 140, yPos);
  yPos += 10;
  pdf.text(`Tax (${invoice.tax_percent}%): ${formatCurrency(invoice.tax_cents)}`, 140, yPos);
  yPos += 10;
  pdf.setFontSize(14);
  pdf.text(`Total: ${formatCurrency(invoice.total_cents)}`, 140, yPos);
  
  // Notes
  if (invoice.notes) {
    yPos += 20;
    pdf.setFontSize(12);
    pdf.text('Notes:', 20, yPos);
    yPos += 10;
    pdf.text(invoice.notes, 20, yPos);
  }
  
  return pdf.output('blob');
};