# Automatic Payment System Setup Guide

## Overview

Your DJ Enoch website now has a fully automated payment system using PesaPal. Users can pay via:
- **Airtel Money**
- **MTN Mobile Money**
- **Credit/Debit Cards**

## What Changed

### 1. Removed Manual Payment
- ❌ Removed manual Airtel Money proof submission
- ❌ Removed admin approval process
- ✅ Replaced with automatic PesaPal processing

### 2. New Payment Flow

#### Subscriptions/Movie Passes
```
User clicks "Buy Now" on Subscription page
    ↓
Stored in sessionStorage as pending_payment_item
    ↓
Redirected to /payment page
    ↓
Payment page shows order summary
    ↓
User clicks "Pay with PesaPal"
    ↓
Redirected to PesaPal portal (choose payment method)
    ↓
After payment, redirected back to /payment?orderTrackingId=XXX
    ↓
Backend verifies payment with PesaPal
    ↓
If successful: Auto-approve and redirect to /my-library
```

#### Software Downloads (Paid)
```
User clicks "Download" on Software that costs 5,000 UGX
    ↓
If logged in: Redirected to /payment page
    ↓
Same payment flow as above
    ↓
After successful payment: Download starts automatically
```

#### Movies (with Pass Required)
```
Unauthenticated user sees "Log in" button
    ↓
After login/signup, sees "Get a Pass" button if no active pass
    ↓
Clicking "Get a Pass" redirects to /subscription
    ↓
After purchasing pass via PesaPal: Can play/download movies
```

## Setup Instructions

### 1. Supabase Environment Variables

Go to your Supabase project → Settings → Environment Variables and add:

```env
PESAPAL_CONSUMER_KEY=IIXqyhUbJU0K1enfdpiUbKGIxEZKwd6+
PESAPAL_CONSUMER_SECRET=is90iDNzszdk0+yz0TCKDCQ=
PESAPAL_MERCHANT_REFERENCE=DJENOCH
PESAPAL_ENVIRONMENT=production
APP_URL=https://yourdomain.com
```

**Note:** Replace `yourdomain.com` with your actual domain.

### 2. PesaPal Configuration

Your credentials are set up for **PRODUCTION** environment by default.

To test in **SANDBOX** first:
- Set `PESAPAL_ENVIRONMENT=sandbox`
- Get sandbox credentials from PesaPal dashboard
- Update `PESAPAL_CONSUMER_KEY` and `PESAPAL_CONSUMER_SECRET`
- Test the flow
- Switch back to production when ready

### 3. Callback URL Configuration (in PesaPal Dashboard)

Set your IPN callback URL to:
```
https://[YOUR_SUPABASE_URL]/functions/v1/make-98d801c7-music/payments/pesapal/callback
```

Example:
```
https://nlhpnvzpbceolsbozrjw.supabase.co/functions/v1/make-98d801c7-music/payments/pesapal/callback
```

### 4. Testing

#### Test Flow:
1. **Don't use production credentials yet** - Use sandbox first
2. Go to `/subscription` page
3. Click "Buy Now" on any plan
4. On payment page, click "Pay with PesaPal"
5. Test payment with test credentials provided by PesaPal
6. Verify payment processes correctly
7. Check that user is redirected to /my-library

#### Troubleshooting:
- Check browser console for errors
- Check Supabase function logs for backend errors
- Verify PesaPal credentials are correct
- Ensure callback URL is reachable from internet

## Payment Item Types

### Subscriptions
- **Type**: `subscription`
- **Price**: Varies by plan (500-225,000 UGX)
- **Duration**: 2 hours to Lifetime
- **Redirect after payment**: `/my-library`

### Software
- **Type**: `software`
- **Price**: 5,000 UGX (non-Android platforms)
- **Android**: FREE (no payment required)
- **Redirect after payment**: Auto-downloads file

### Movies (future)
- **Type**: `movie`
- **Price**: Via subscription pass only
- **Redirect after payment**: `/movies`

## Data Structure

### Payment Record
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
  status: "approved", // auto-approved
  createdAt: "2024-04-21T...",
  approvedAt: "2024-04-21T...",
}
```

### Order Tracking
```javascript
{
  orderTrackingId: "PESAPAL_ORDER_ID",
  userId: "supabase_user_id",
  amount: 5000,
  currency: "UGX",
  items: [],
  customerEmail: "user@email.com",
  customerName: "User Name",
  status: "completed", // pending, completed, failed
  createdAt: "2024-04-21T...",
}
```

## Email Notifications

Users receive automatic emails for:

### ✅ Payment Success
- Subject: "Payment Successful - DJ Enoch"
- Contains: Order details, receipt link
- Triggers: Immediately after payment verification

### ❌ Payment Failed
- Subject: "Payment Could Not Be Processed - DJ Enoch"
- Contains: Failure reason, retry link
- Triggers: When PesaPal reports payment failed/cancelled

## Security Notes

1. **No sensitive data in localStorage** - Payment details cleared after use
2. **User ID verification** - Payment verified against user ID
3. **PesaPal verification** - All payments verified with PesaPal API
4. **HTTPS required** - For production payment processing
5. **Rate limiting** - Prevents abuse of payment endpoints

## Monitoring & Analytics

### Check Payment Status
```
GET /make-98d801c7-music/payments/pesapal/status/{orderTrackingId}
```

### Get User Payments
```
GET /make-98d801c7-music/payments/user/{userId}
```

### Get Receipts
```
GET /make-98d801c7-music/receipts/user/{userId}
GET /make-98d801c7-music/receipts/{receiptId}
```

## Troubleshooting

### "Payment processing failed"
- Check network connectivity
- Verify PesaPal credentials are correct
- Check Supabase function logs

### User not redirected after payment
- Check browser console for errors
- Verify `orderTrackingId` is in URL parameters
- Check if payment was actually approved in PesaPal

### Download not starting
- Check if payment was successfully verified
- Check browser download settings
- Try downloading directly from /software page

### Movies locked for user with subscription
- Check `pending_payment_item` in sessionStorage
- Verify payment was recorded in database
- Check user subscription expiration date

## Going Live

1. ✅ Test thoroughly in sandbox
2. ✅ Configure production PesaPal credentials
3. ✅ Update `PESAPAL_ENVIRONMENT` to `production`
4. ✅ Configure callback URL in PesaPal dashboard
5. ✅ Deploy to production
6. ✅ Test live payments with small amounts
7. ✅ Monitor payment logs for issues

## Support

For PesaPal integration issues:
- Contact: PesaPal Support
- Docs: https://developer.pesapal.com

For application issues:
- Check Supabase function logs
- Check browser console errors
- Verify environment variables are set
