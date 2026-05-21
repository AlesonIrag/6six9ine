# Resend Domain Verification - Complete Setup Guide 📧

## ⚠️ IMPORTANT: Why You Need This

**Current Issue**: Emails are being sent to `order.email` (customer's actual email), but Resend's free tier has restrictions:
- ✅ Can send to verified email addresses
- ❌ Cannot send to random customer emails without domain verification

**Solution**: Verify your domain with Resend to send emails to ANY customer email address.

---

## What Happens Without Domain Verification?

### Current Behavior:
```
Customer places order → Email tries to send to customer@example.com → ❌ FAILS
Error: "You can only send testing emails to your own email address"
```

### After Domain Verification:
```
Customer places order → Email sends to customer@example.com → ✅ SUCCESS
Customer receives: "Payment Approved" email
```

---

## Step-by-Step Domain Verification

### **Option 1: Use Your Own Domain (Recommended)**

If you own a domain like `6six9ine.com`:

#### **Step 1: Login to Resend**
1. Go to https://resend.com/login
2. Login with your account (email: `itonnn2004@gmail.com`)

#### **Step 2: Add Your Domain**
1. Click "Domains" in the sidebar
2. Click "Add Domain"
3. Enter your domain: `6six9ine.com`
4. Click "Add"

#### **Step 3: Add DNS Records**
Resend will show you DNS records to add. You need to add these to your domain registrar (GoDaddy, Namecheap, etc.):

**Example DNS Records:**
```
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC... (long string)

Type: MX
Name: @
Value: feedback-smtp.resend.com
Priority: 10
```

#### **Step 4: Verify Domain**
1. Add all DNS records to your domain registrar
2. Wait 5-10 minutes for DNS propagation
3. Go back to Resend dashboard
4. Click "Verify" next to your domain
5. ✅ Domain verified!

#### **Step 5: Update Environment Variables**
Update your `.env.local` file:

```env
FROM_EMAIL=orders@6six9ine.com
ADMIN_EMAIL=admin@6six9ine.com
```

**Done!** Now you can send emails to ANY customer email address! 🎉

---

### **Option 2: Use a Subdomain (Alternative)**

If you want to use a subdomain like `mail.6six9ine.com`:

1. Follow same steps as Option 1
2. Enter subdomain instead: `mail.6six9ine.com`
3. Add DNS records for the subdomain
4. Update `.env.local`:
   ```env
   FROM_EMAIL=orders@mail.6six9ine.com
   ```

---

### **Option 3: Use Resend's Test Email (Temporary)**

**⚠️ NOT RECOMMENDED FOR PRODUCTION**

If you don't have a domain yet, you can temporarily use Resend's test email, but with limitations:

**Limitations:**
- Can only send to verified email addresses
- Must manually verify each customer email in Resend dashboard
- Not scalable for real business

**How to verify individual emails:**
1. Go to Resend dashboard
2. Click "Emails" → "Verified Emails"
3. Add customer email addresses one by one
4. Customer must click verification link

**This is NOT practical for an e-commerce store!**

---

## How to Add DNS Records

### **If using GoDaddy:**
1. Login to GoDaddy
2. Go to "My Products" → "Domains"
3. Click "DNS" next to your domain
4. Click "Add" to add new records
5. Add each record from Resend
6. Save changes

### **If using Namecheap:**
1. Login to Namecheap
2. Go to "Domain List"
3. Click "Manage" next to your domain
4. Go to "Advanced DNS" tab
5. Click "Add New Record"
6. Add each record from Resend
7. Save changes

### **If using Cloudflare:**
1. Login to Cloudflare
2. Select your domain
3. Go to "DNS" tab
4. Click "Add record"
5. Add each record from Resend
6. Save

---

## Verifying DNS Records

After adding DNS records, verify they're working:

### **Method 1: Use Resend Dashboard**
- Click "Verify" button in Resend dashboard
- If successful: ✅ "Domain verified"
- If failed: ❌ "DNS records not found" (wait longer or check records)

### **Method 2: Use Online DNS Checker**
1. Go to https://mxtoolbox.com/
2. Enter your domain
3. Check if MX and TXT records are visible

### **Method 3: Use Command Line**
```bash
# Check TXT record
nslookup -type=TXT resend._domainkey.6six9ine.com

# Check MX record
nslookup -type=MX 6six9ine.com
```

---

## Testing After Verification

### **Test 1: Send Test Email**
1. Go to Resend dashboard
2. Click "Emails" → "Send Test Email"
3. Enter any email address
4. Click "Send"
5. ✅ Should receive email

### **Test 2: Place Test Order**
1. Go to your website
2. Place a test order with a different email
3. Admin approves payment
4. ✅ Customer should receive "Payment Approved" email

### **Test 3: Check Email Logs**
1. Go to Resend dashboard
2. Click "Logs"
3. See all sent emails
4. Check delivery status

---

## Common Issues & Solutions

### **Issue 1: DNS Records Not Propagating**
**Symptoms**: Verification fails, says "DNS records not found"

**Solutions:**
- Wait 24-48 hours (DNS can take time)
- Clear DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)
- Check records with online DNS checker
- Make sure you added records to correct domain

### **Issue 2: Emails Still Not Sending**
**Symptoms**: Domain verified but emails fail

**Solutions:**
- Check `.env.local` has correct `FROM_EMAIL`
- Restart your Next.js server
- Check Resend API key is correct
- Check Resend dashboard logs for errors

### **Issue 3: Emails Going to Spam**
**Symptoms**: Emails send but go to spam folder

**Solutions:**
- Add SPF record to DNS
- Add DKIM record (Resend provides this)
- Add DMARC record
- Warm up your domain (send gradually increasing emails)
- Ask customers to whitelist your email

### **Issue 4: "Domain Not Verified" Error**
**Symptoms**: Error when sending emails

**Solutions:**
- Go to Resend dashboard and verify domain status
- Re-verify DNS records
- Contact Resend support if stuck

---

## Cost & Pricing

### **Resend Pricing (as of 2024):**

**Free Tier:**
- ✅ 3,000 emails/month
- ✅ 100 emails/day
- ✅ Domain verification included
- ✅ Email logs
- ❌ Limited to verified domains only

**Pro Tier ($20/month):**
- ✅ 50,000 emails/month
- ✅ Unlimited daily sends
- ✅ Multiple domains
- ✅ Priority support
- ✅ Advanced analytics

**For most small e-commerce stores, the FREE tier is sufficient!**

---

## Alternative Email Services

If you don't want to verify a domain, consider these alternatives:

### **1. SendGrid**
- Free tier: 100 emails/day
- Requires domain verification
- Similar setup to Resend

### **2. Mailgun**
- Free tier: 5,000 emails/month
- Requires domain verification
- More complex setup

### **3. Amazon SES**
- Very cheap: $0.10 per 1,000 emails
- Requires AWS account
- Requires domain verification
- More technical setup

### **4. Gmail SMTP (NOT RECOMMENDED)**
- Free but limited to 500 emails/day
- Often blocked by spam filters
- Not professional for business

**Recommendation: Stick with Resend and verify your domain!**

---

## Quick Start Checklist

- [ ] Own a domain (e.g., `6six9ine.com`)
- [ ] Login to Resend dashboard
- [ ] Add domain to Resend
- [ ] Copy DNS records from Resend
- [ ] Add DNS records to domain registrar
- [ ] Wait 10-60 minutes for propagation
- [ ] Click "Verify" in Resend dashboard
- [ ] Update `.env.local` with verified domain email
- [ ] Restart Next.js server
- [ ] Test by placing an order
- [ ] ✅ Customer receives email!

---

## Current Code Status

✅ **Code is ready!** The email system is already configured to send to customer emails (`order.email`).

❌ **Domain not verified yet** - This is the only thing blocking customer emails.

**Once you verify your domain, everything will work automatically!**

---

## Need Help?

### **Resend Support:**
- Email: support@resend.com
- Docs: https://resend.com/docs
- Discord: https://resend.com/discord

### **DNS Help:**
- GoDaddy Support: https://www.godaddy.com/help
- Namecheap Support: https://www.namecheap.com/support/
- Cloudflare Support: https://support.cloudflare.com/

---

## Summary

**The Problem:**
- Resend free tier requires domain verification to send to customer emails
- Without verification, emails can only go to your own email

**The Solution:**
1. Verify your domain with Resend (takes 30 minutes)
2. Add DNS records to your domain registrar
3. Update `.env.local` with verified domain email
4. ✅ Done! Customers will receive emails

**The code is already fixed and ready to go!** Just verify your domain and you're all set! 🚀

---

**Status**: ✅ Code Updated - Sends to `order.email` (customer's actual email)  
**Next Step**: Verify domain at https://resend.com/domains  
**Time Required**: 30 minutes setup + 10-60 minutes DNS propagation
