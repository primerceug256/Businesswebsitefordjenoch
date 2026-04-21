# Payment Management Features

## New Features Added

### 1. User Payment History Page (`/payment-history`)
Users can view their complete payment history with the ability to:
- ✅ See all past payments and subscriptions
- ✅ View payment status (Approved, Pending, Rejected)
- ✅ Download receipts (if available)
- ✅ Request refunds for approved payments
- ✅ View detailed payment information
- ✅ Track total amount spent

**Access:** Users → Menu → Account → Payments

### 2. Admin Payment Dashboard (`/admin/payments`)
Admins can manage all payments with:
- ✅ View all user payments in a comprehensive dashboard
- ✅ Filter by status (All, Approved, Pending, Rejected)
- ✅ Search payments by user name, email, or payment ID
- ✅ View payment statistics:
  - Total Revenue (only approved payments)
  - Total Payments count
  - Approved payments count
  - Pending payments count
- ✅ Expand payment details to see items purchased
- ✅ Approve/Reject pending payments
- ✅ Process refunds for approved payments
- ✅ Export payment data to CSV for accounting

**Access:** Admins → Menu → Admin → Payments Dashboard

### 3. Refund System

#### User-Initiated Refunds
Users can request refunds directly from the Payment History page:
1. Navigate to `/payment-history`
2. Find the approved payment
3. Click "View Details"
4. Click "Request Refund"
5. Confirm the refund request
6. Admin is notified and will review

#### Admin-Approved Refunds
Admins can process refunds from the Payment Dashboard:
1. Navigate to `/admin/payments`
2. Expand a payment row
3. Click "Refund" button (only for approved payments)
4. User receives refund notification email

**Refund Status:** Tracked with `refundedAt` and `refundReason` fields

### 4. Payment Records Structure

**Enhanced Payment Record:**
```javascript
{
  id: "payment-TIMESTAMP-RANDOM",
  userId: "supabase_user_id",
  userName: "User Name",
  userEmail: "user@email.com",
  items: "stringified_array_of_items",
  total: 5000,
  paymentMethod: "pesapal",
  orderTrackingId: "PESAPAL_ORDER_ID",
  status: "approved|pending|rejected|refunded",
  createdAt: "2024-04-21T...",
  approvedAt: "2024-04-21T...",
  refundRequested: false,
  refundRequestedAt: null,
  refundedAt: null,
  refundReason: null,
  receiptId: "optional_receipt_id"
}
```

## API Endpoints

### User Endpoints

**Get User Payment History**
```
GET /make-98d801c7-music/payments/user/:userId
Authorization: Bearer {publicAnonKey}
```
Returns: Array of user's payments

**Request Refund**
```
POST /make-98d801c7-music/payments/request-refund
Authorization: Bearer {publicAnonKey}
Content-Type: application/json

{
  "paymentId": "payment-..."
}
```
Returns: `{ success: true, message: "Refund request submitted" }`

### Admin Endpoints

**Get All Payments**
```
GET /make-98d801c7-music/admin/payments
Authorization: Bearer {publicAnonKey}
```
Returns: Array of all payments sorted by date

**Approve Payment**
```
POST /make-98d801c7-music/admin/approve-payment
Authorization: Bearer {publicAnonKey}
Content-Type: application/json

{
  "paymentId": "payment-..."
}
```

**Reject Payment**
```
POST /make-98d801c7-music/admin/reject-payment
Authorization: Bearer {publicAnonKey}
Content-Type: application/json

{
  "paymentId": "payment-..."
}
```

**Refund Payment**
```
POST /make-98d801c7-music/admin/refund-payment
Authorization: Bearer {publicAnonKey}
Content-Type: application/json

{
  "paymentId": "payment-...",
  "reason": "Admin refund reason" (optional)
}
```

## Email Notifications

### User Receives:
- **Payment Approved Email** - When admin approves or PesaPal auto-approves
- **Payment Rejected Email** - When payment is rejected
- **Refund Notification Email** - When refund is processed
- **Receipt Email** - When receipt is generated (optional)

### Admin Receives:
- **Refund Request Notification** - When user requests refund
- **New Payment Submitted** - When manual payment submitted

## Dashboard Features

### Admin Payment Dashboard UI
- **Stats Cards:** Revenue, Total Payments, Approved, Pending
- **Search & Filter:** Find specific payments quickly
- **Expandable Rows:** View item details and take actions
- **Export to CSV:** Download payment data for accounting/reporting
- **Real-time Status:** See payment status at a glance

### User Payment History UI
- **Stats Cards:** Total Spent, Total Payments, Approved Count
- **Payment List:** All user's payments with status indicators
- **Expandable Details:** View items and payment details
- **Quick Actions:** Download receipts, request refunds
- **Status Colors:**
  - 🟢 Green = Approved
  - 🟡 Orange = Pending
  - 🔴 Red = Rejected

## Workflow Examples

### Example 1: User Requests Refund
```
1. User logs in → Menu → Account → Payments
2. User finds approved payment → "View Details"
3. User clicks "Request Refund" → Confirms
4. Admin receives notification
5. Admin goes to /admin/payments
6. Admin finds payment → Expands → Clicks "Refund"
7. User receives refund notification email
8. Payment status changes to "refunded"
```

### Example 2: Admin Approves Pending Payment
```
1. Admin navigates to /admin/payments
2. Filters by "Pending" status
3. Admin expands payment row → Reviews items
4. Admin clicks "Approve"
5. Payment status changes to "approved"
6. User receives approval email
```

### Example 3: Export Payment Data
```
1. Admin at /admin/payments
2. Admin clicks "Export" button
3. CSV file downloads with columns:
   - ID, Name, Email, Amount, Method, Status, Date
4. Admin can import to Excel/accounting software
```

## Security & Validation

✅ **User Authorization:** Users can only see their own payments  
✅ **Admin Only:** Admin endpoints require admin privileges  
✅ **Status Validation:** Can't refund pending/rejected payments  
✅ **Double Refund Prevention:** Checks if already refunded  
✅ **Email Validation:** Admin notified of refund requests  

## Database Structure

All payment data stored in Supabase with KV store:
- `payment:{paymentId}` - Individual payment record
- `payment:user:{userId}` - User's payment list (indexed)
- `payment:approved:{paymentId}` - Approved payments index
- `payment:refunded:{paymentId}` - Refunded payments index

## Monitoring & Analytics

### Available Metrics:
- Total Revenue (Approved payments only)
- Payment counts by status
- Refund rate
- Average transaction value
- User payment frequency

### Future Enhancements:
- Payment analytics dashboard
- Revenue reports by date range
- Refund policy automation
- Subscription renewal tracking
- Payment method analytics

## Troubleshooting

### Issue: "No payments found"
- Ensure user is logged in
- Check if payments were actually created
- Verify payment status in database

### Issue: "Can't process refund"
- Payment must be in "approved" status
- Check user permissions (must be admin)
- Verify payment exists in database

### Issue: Refund email not received
- Check admin email is configured
- Verify email provider is set up
- Check email queue in KV store

## Configuration

### Admin Email Setup
Set in Supabase environment variables:
```
ADMIN_EMAIL = your-admin@email.com
```

### Email Provider
Currently emails are queued in KV store. Integrate with:
- SendGrid
- Resend
- Mailgun
- AWS SES

See `supabase/functions/server/email.tsx` for integration points.

## Testing

### Test Payment History:
1. Log in as user
2. Make a test payment
3. Navigate to `/payment-history`
4. Verify payment appears
5. Request refund
6. Check notifications

### Test Admin Dashboard:
1. Log in as admin
2. Navigate to `/admin/payments`
3. Verify all payments load
4. Test filters and search
5. Expand payment details
6. Test approve/reject/refund actions
7. Verify CSV export works

## Support

For issues or questions:
- Check browser console for frontend errors
- Check Supabase function logs for backend errors
- Verify environment variables are set
- Check email queue in KV store for notification issues
