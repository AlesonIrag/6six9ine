# Email Not Sending - Troubleshooting Guide

## Why Emails Might Not Be Sending

### 1. Order Approval Failing (Most Likely)
**Problem:** The approve/reject button is failing BEFORE it gets to send the email.

**How to Check:**
1. Open browser console (F12)
2. Click approve payment button
3. Look for these logs:
   ```
   ✅ Approving payment for order: ORD123ABC
   📋 Order document ID: <id>
   📡 Response status: 200
   💾 Payment approved in Firebase
   📧 Sending payment approved email...
   ```

**If you see an error BEFORE "📧 Sending payment approved email...":**
- The order approval failed
- Email was never attempted
- Fix the order approval first (we added detailed logging for this)

### 2. Resend API Key Issues
**Problem:** API key might be invalid or rate-limited.

**How to Check:**
1. Go to https://resend.com/api-keys
2. Verify your API key: `re_MPtdKLwS_EM4LuLSipnyx6VcNz6Kt2jEy`
3. Check if it's active and not rate-limited
4. Free tier limits: 3,000 emails/month, 100 emails/day

**If API key is invalid:**
- Generate a new one from Resend dashboard
- Update `.env.local` with new key
- Restart dev server

### 3. Email Address Issues
**Problem:** Sending to unverified email or from unverified domain.

**Current Setup:**
- **From:** `onboarding@resend.dev` (Resend's test email - always works)
- **To Admin:** `admin@6six9ine.com`
- **To Customer:** Order email address

**Note:** `onboarding@resend.dev` is Resend's test email that works without verification. This should work fine for testing.

### 4. Server Not Running
**Problem:** Dev server needs to be restarted after env changes.

**Solution:**
1. Stop dev server (Ctrl+C)
2. Run `npm run dev` again
3. Try sending email again

## Testing Email Functionality

### Test 1: Check if Resend is Working
Create a test file: `test-email.js`

```javascript
const { Resend } = require('resend');

const resend = new Resend('re_MPtdKLwS_EM4LuLSipnyx6VcNz6Kt2jEy');

async function testEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'your-email@example.com', // Replace with your email
      subject: 'Test Email from 6SIX9INE',
      html: '<h1>Test Email</h1><p>If you receive this, Resend is working!</p>',
    });

    if (error) {
      console.error('❌ Error:', error);
    } else {
      console.log('✅ Email sent:', data);
    }
  } catch (error) {
    console.error('❌ Exception:', error);
  }
}

testEmail();
```

Run: `node test-email.js`

### Test 2: Check Email API Endpoint
Use browser console or Postman:

```javascript
fetch('http://localhost:3000/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'customer-confirmation',
    order: {
      orderId: 'TEST123',
      customerName: 'Test Customer',
      email: 'your-email@example.com', // Your email
      phone: '0912 345 6789',
      address: 'Test Address',
      total: 1000,
      createdAt: new Date().toISOString(),
      items: [
        {
          name: 'Test Product',
          size: 'M',
          color: 'Black',
          quantity: 1,
          price: 1000
        }
      ]
    }
  })
})
.then(res => res.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

## Common Issues & Solutions

### Issue 1: "Failed to approve payment"
**Symptom:** Error before email is attempted

**Solution:** 
- Check console logs for detailed error
- Likely `selectedOrder.id` is undefined
- Fix order approval first (see ORDER_APPROVAL_ERROR_FIX.md)

### Issue 2: "Email sent successfully" but not received
**Symptom:** Console shows success but no email in inbox

**Possible Causes:**
1. **Spam folder** - Check spam/junk folder
2. **Wrong email address** - Verify customer email in order
3. **Resend delay** - Can take 1-2 minutes
4. **Email provider blocking** - Some providers block automated emails

**Solution:**
- Check spam folder
- Wait 2-3 minutes
- Try different email address
- Check Resend dashboard for delivery status

### Issue 3: "Resend API error"
**Symptom:** Error from Resend API

**Common Errors:**
- `401 Unauthorized` - Invalid API key
- `429 Too Many Requests` - Rate limit exceeded
- `400 Bad Request` - Invalid email format

**Solution:**
- Verify API key is correct
- Check rate limits (100/day free tier)
- Verify email addresses are valid

## Debugging Checklist

- [ ] Dev server is running (`npm run dev`)
- [ ] `.env.local` has correct `RESEND_API_KEY`
- [ ] `.env.local` has correct `ADMIN_EMAIL`
- [ ] `.env.local` has correct `FROM_EMAIL`
- [ ] Resend package is installed (`npm install resend`)
- [ ] Browser console is open (F12)
- [ ] Order approval succeeds (no errors before email)
- [ ] Console shows "📧 Sending payment approved email..."
- [ ] Console shows "✅ Payment approved email sent to customer"
- [ ] Checked spam folder
- [ ] Waited 2-3 minutes for email delivery

## Quick Fix Steps

1. **Restart Dev Server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Check Console Logs:**
   - Open browser console (F12)
   - Click approve payment
   - Look for email-related logs

3. **Test Email API Directly:**
   - Use the Test 2 code above
   - Replace with your email
   - Check if email arrives

4. **Verify Resend Dashboard:**
   - Go to https://resend.com/emails
   - Check if emails are being sent
   - Check delivery status

## Expected Console Output (Success)

```
✅ Approving payment for order: ORD123ABC
📋 Order document ID: abc123xyz
📡 Response status: 200
📡 Response ok: true
✅ Server response: {...}
💾 Payment approved in Firebase
📧 Sending payment approved email...
📧 [Email API] Sending payment-approved email for order: ORD123ABC
✅ [Email API] payment-approved email sent successfully
✅ Payment approved email sent to customer
```

## Still Not Working?

If emails still aren't sending after trying all the above:

1. **Share Console Output:**
   - Copy all console logs
   - Share the exact error messages
   - Include both client and server logs

2. **Check Resend Dashboard:**
   - Go to https://resend.com/emails
   - Screenshot the email list
   - Check for any errors

3. **Verify Environment:**
   - Share `.env.local` (hide sensitive parts)
   - Confirm all variables are set
   - Confirm dev server restarted

## Contact Support

If you've tried everything and emails still don't work:
- Resend Support: https://resend.com/support
- Check Resend Status: https://status.resend.com/
