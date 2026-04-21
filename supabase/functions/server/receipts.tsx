import * as kv from "./kv_store.tsx";
import * as music from "./music.tsx";

export interface Receipt {
  id: string;
  paymentId: string;
  userId: string;
  items: string;
  total: number;
  tax: number;
  subtotal: number;
  receiptNumber: string;
  receiptUrl?: string;
  downloadUrl?: string;
  createdAt: string;
}

// Generate receipt number with prefix
function generateReceiptNumber(): string {
  const date = new Date();
  const timestamp = date.getTime();
  const random = Math.floor(Math.random() * 1000);
  return `RCP-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(random).padStart(4, '0')}`;
}

// Generate HTML receipt content
function generateReceiptHTML(receipt: Receipt, userName: string, userEmail: string): string {
  const items = JSON.parse(receipt.items);
  const itemsHTML = items.map((item: any) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Payment Receipt - DJ Enoch</title>
      <style>
        body { font-family: Arial, sans-serif; color: #333; background: #f5f5f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #ff6600; padding-bottom: 20px; }
        .header h1 { margin: 0; color: #ff6600; font-size: 28px; }
        .header p { margin: 5px 0; color: #666; }
        .section { margin: 20px 0; }
        .section h3 { color: #ff6600; font-size: 14px; text-transform: uppercase; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; }
        .info-label { font-weight: bold; color: #666; }
        .info-value { color: #333; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { text-align: left; padding: 10px; background: #f9f9f9; border-bottom: 2px solid #ff6600; font-weight: bold; }
        .totals { margin-top: 20px; padding-top: 20px; border-top: 2px solid #ff6600; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 16px; font-weight: bold; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px; }
        .receipt-number { color: #ff6600; font-weight: bold; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>DJ ENOCH PRO</h1>
          <p>Payment Receipt</p>
        </div>

        <div class="section">
          <h3>Payment Details</h3>
          <div class="info-row">
            <span class="info-label">Receipt Number:</span>
            <span class="info-value receipt-number">${receipt.receiptNumber}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Date:</span>
            <span class="info-value">${new Date(receipt.createdAt).toLocaleDateString()}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Payment ID:</span>
            <span class="info-value">${receipt.paymentId}</span>
          </div>
        </div>

        <div class="section">
          <h3>Customer Information</h3>
          <div class="info-row">
            <span class="info-label">Name:</span>
            <span class="info-value">${userName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">${userEmail}</span>
          </div>
        </div>

        <div class="section">
          <h3>Items Purchased</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
        </div>

        <div class="totals">
          <div class="info-row">
            <span class="info-label">Subtotal:</span>
            <span class="info-value">$${receipt.subtotal.toFixed(2)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Tax (0%):</span>
            <span class="info-value">$${receipt.tax.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>TOTAL:</span>
            <span>$${receipt.total.toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for your purchase! For support, contact us at +256 747 816 444</p>
          <p style="margin-top: 10px; color: #ccc;">This is an automated receipt. No signature required.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function createReceipt(
  paymentId: string,
  userId: string,
  items: string,
  total: number,
  userName: string,
  userEmail: string
): Promise<Receipt | null> {
  try {
    const receipt: Receipt = {
      id: `receipt-${Date.now()}`,
      paymentId,
      userId,
      items,
      total,
      subtotal: total,
      tax: 0,
      receiptNumber: generateReceiptNumber(),
      createdAt: new Date().toISOString(),
    };

    // Generate HTML receipt
    const htmlContent = generateReceiptHTML(receipt, userName, userEmail);

    // Store receipt metadata
    await kv.set(`receipt:${receipt.id}`, receipt);
    await kv.set(`receipt:payment:${paymentId}`, receipt.id);

    console.log(`[RECEIPT CREATED] ID: ${receipt.id}, Payment: ${paymentId}, Receipt#: ${receipt.receiptNumber}`);
    
    return receipt;
  } catch (error) {
    console.error('Failed to create receipt:', error);
    return null;
  }
}

export async function getReceiptByPayment(paymentId: string): Promise<Receipt | null> {
  try {
    const receiptId = await kv.get(`receipt:payment:${paymentId}`);
    if (!receiptId) return null;
    
    const receipt = await kv.get(`receipt:${receiptId}`) as Receipt;
    return receipt || null;
  } catch (error) {
    console.error('Failed to fetch receipt:', error);
    return null;
  }
}

export async function getUserReceipts(userId: string): Promise<Receipt[]> {
  try {
    const receipts = await kv.getByPrefix(`receipt:`);
    return receipts.filter(r => r && typeof r === 'object' && r.userId === userId) as Receipt[];
  } catch (error) {
    console.error('Failed to fetch user receipts:', error);
    return [];
  }
}
