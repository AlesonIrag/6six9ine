# Resend Domain Verification - Required for Customer Emails

## THE ISSUE:

Resend's free tier only allows sending emails to **your own email address** (`itonnn2004@gmail.com`).

To send emails to customers, you MUST verify a domain.

## SOLUTION:

### Option 1: For Testing Only (Temporary)

I've temporarily changed the email to send to your email (`itonnn2004@gmail.com`) so you can test the system.

**This is NOT a production solution** - customers won't receive emails.

### Option 2: Verify Your Domain (Production Solution)

#### Step 1: Go to Resend Dashboard
https://resend.com/domains

#### Step 2: Add Your Domain
- Click "Add Domain"
- Enter your domain: `6six9ine.com`
- Click "Add"

#### Step 3: Add DNS Records
Resend will give you DNS records to add. You need to add these to your domain registrar (where you bought 6six9ine.com):

**Example DNS Records:**
```
Type: TXT
Name: _resend
Value: resend-verify=abc123xyz...
```

```
Type: MX
Name: @
Value: mx.resend.com
Priority: 10
```

```
Type: TXT  
Name: @
Value: v=spf1 include:_spf.resend.com ~all
```

#### Step 4: Wait for Verification
- DNS changes can take 1-48 hours
- Resend will verify automatically
- You'll get an email when verified

#### Step 5: Update Your Code
Once verified, update `.env.local`:

```
FROM_EMAIL=noreply@6six9ine.com
```

Or:
```
FROM_EMAIL=orders@6six9ine.com
```

Or:
```
FROM_EMAIL=support@6six9ine.com
```

(Any email using your verified domain)

#### Step 6: Update Email Library
Change back to sending to customer email:

In `src/lib/email.js`, change:
```javascript
to: 'itonnn2004@gmail.com', // TEMPORARY
```

Back to:
```javascript
to: order.email,
```

---

## Alternative: Use a Different Email Service

If you don't want to verify a domain, you can use:

### 1. Gmail SMTP (Free)
- Use your Gmail account
- Configure SMTP settings
- Limited to 500 emails/day

### 2. SendGrid (Free Tier)
- 100 emails/day free
- No domain verification required for testing
- https://sendgrid.com

### 3. Mailgun (Free Tier)
- 5,000 emails/month free
- Requires domain verification
- https://mailgun.com

---

## Current Status:

✅ **Resend is configured correctly**
✅ **API key is valid**
❌ **Domain not verified** - Can only send to `itonnn2004@gmail.com`

## For Testing Right Now:

I've changed the code to send all emails to your email (`itonnn2004@gmail.com`) so you can test the system.

**Test it:**
1. Restart dev server
2. Approve a payment
3. Check your inbox at `itonnn2004@gmail.com`
4. You should receive the email!

## For Production:

You MUST verify your domain at https://resend.com/domains

---

## Quick Reference:

| Service | Free Tier | Domain Required | Best For |
|---------|-----------|-----------------|----------|
| Resend | 3,000/month | Yes (for customers) | Production |
| SendGrid | 100/day | No | Testing |
| Gmail SMTP | 500/day | No | Small scale |
| Mailgun | 5,000/month | Yes | Production |

---

## Files Modified:

- `src/lib/email.js` - Temporarily sending to your email for testing

## Next Steps:

1. **Test now** - Emails will go to your inbox
2. **Verify domain** - For production use
3. **Update code** - Change back to `order.email` after verification
