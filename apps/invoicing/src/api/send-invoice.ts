// API stub for sending invoices
// This will be replaced with n8n integration later

export async function sendInvoice(invoiceId: string) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(`Sending invoice ${invoiceId} via email...`);
  
  // In real implementation, this would:
  // 1. Generate PDF if not exists
  // 2. Send email to customer with PDF attachment
  // 3. Update invoice status to 'sent'
  // 4. Set sent_at timestamp
  
  return { ok: true };
}