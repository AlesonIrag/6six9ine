# Email Not Sending After Payment Approval - Debug Guide

## Enhanced Logging Added

I've added comprehensive logging to help us see exactly what's happening with emails.

## What to Do Now:

### 1. Open Browser Console (F12)

### 2. Approve a Payment

Click the "✓ APPROVE PAYMENT" button

### 3. Watch for These Logs:

#### **Step 1: Order Approval**
```
✅ Approving payment for order: ORD123ABC
📋 Order document ID: abc123
📡 Response status: 200
📡 Response ok: true
✅ Server response: {...}
💾 Payment approved in Firebase
```

#### **Step 2: Email Attempt**
```
📧 Sending payment approved email...
📧 Customer email: customer@example.com
📧 Order ID: ORD123ABC
```

#### **Step 3: Email API Call**
```
📧 Email API response status: 200
```

#### **Step 4: Success or Error**

**If Successful:**
```
✅ Payment approved email sent successfully!
✅ Email result: { id: '...', ... }
```

**If Failed:**
```
❌ Failed to send payment approved email
❌ Email API error: { error: '...' }
❌ Status: 500
```

## Common Issues & What Logs Show:

### Issue 1: No Customer Email
**Logs:**
```
❌ [Email API] No email address provided in order
```

**Cause:** Order doesn't have customer email

**Solution:** Check checkout form - email field might not be saving

---

### Issue 2: Resend API Key Invalid
**Logs:**
```
❌ [Email API] Failed to send payment-approved email: { error: '401 Unauthorized' }
```

**Cause:** Invalid or expired Resend API key

**Solution:** 
1. Go to https://resend.com/api-keys
2. Generate new API key
3. Update `.env.local`
4. Restart dev server

---

### Issue 3: Rate Limit Exceeded
**Logs:**
```
❌ [Email API] Failed to send payment-approved email: { error: '429 Too Many Requests' }
```

**Cause:** Exceeded Resend free tier limits (100 emails/day)

**Solution:**
1. Wait 24 hours
2. Or upgrade Resend plan
3. Or use different email service

---

### Issue 4: Invalid Email Format
**Logs:**
```
❌ [Email API] Failed to send payment-approved email: { error: 'Invalid email address' }
```

**Cause:** Customer email is malformed

**Solution:** Validate email format in checkout form

---

### Issue 5: Resend Package Error
**Logs:**
```
❌ [Email API] Exception: Cannot find module 'resend'
```

**Cause:** Resend package not installed

**Solution:**
```bash
npm install resend
```

---

## Testing Steps:

### Test 1: Check Console Logs
1. Open console (F12)
2. Approve payment
3. Copy ALL console logs
4. Share with me

### Test 2: Test Email API Directly
Open console and run:

```javascript
fetch('http://localhost:3000/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'payment-approved',
    order: {
      orderId: 'TEST123',
      customerName: 'Test Customer',
      email: 'your-email@example.com', // YOUR EMAIL HERE
      phone: '0912 345 6789',
      address: 'Test Address',
      total: 1000,
      createdAt: new Date().toISOString(),
      items: [{
        name: 'Test Product',
        size: 'M',
        color: 'Black',
        quantity: 1,
        price: 1000
      }]
    }
  })
})
.then(res => res.json())
.then(data => console.log('✅ Response:', data))
.catch(err => console.error('❌ Error:', err));
```

### Test 3: Run Test Script
```bash
node test-email.js
```

This will test Resend directly without the order system.

---

## What Each Log Means:

| Log | Meaning |
|-----|---------|
| `📧 Sending payment approved email...` | Email attempt started |
| `📧 Customer email: ...` | Shows customer's email address |
| `📧 [Email API] Received request...` | Email API received the request |
| `📧 [Email API] Sending payment approved email...` | Email function called |
| `✅ [Email API] ... email sent successfully` | Email sent by Resend |
| `❌ [Email API] Failed to send...` | Email failed - check error details |
| `❌ No email address provided` | Order missing email field |

---

## Expected Full Console Output (Success):

```
✅ Approving payment for order: ORD123ABC
📋 Order document ID: abc123xyz
📡 Response status: 200
📡 Response ok: true
✅ Server response: { id: 'abc123xyz', ... }
💾 Payment approved in Firebase
📧 Sending payment approved email...
📧 Customer email: customer@example.com
📧 Order ID: ORD123ABC
📧 Email API response status: 200
✅ Payment approved email sent successfully!
✅ Email result: { id: 'email-id-123', ... }
```

---

## Next Steps:

1. **Approve a payment** and watch console
2. **Copy all logs** from console
3. **Share the logs** with me
4. I'll tell you exactly what's wrong

---

## Quick Fixes:

### If email is undefined:
Check checkout form saves email to order

### If Resend error:
Check API key in `.env.local`

### If rate limit:
Wait 24 hours or upgrade plan

### If package error:
Run `npm install resend`

---

## Files Modified:
1. `src/app/admin/page.js` - Enhanced email logging
2. `src/app/api/send-email/route.js` - Enhanced API logging

Now when you approve payment, you'll see EXACTLY what's happening with the email! 🔍
