# Domain Verification - Quick Start (5 Minutes) ⚡

## The Problem
❌ Customers not receiving emails because domain isn't verified with Resend

## The Solution
✅ Verify your domain (takes 30 minutes total)

---

## Step 1: Login to Resend (2 minutes)
```
1. Go to: https://resend.com/login
2. Login with: itonnn2004@gmail.com
3. Click "Domains" in sidebar
```

---

## Step 2: Add Your Domain (1 minute)
```
1. Click "Add Domain"
2. Enter: 6six9ine.com (or your domain)
3. Click "Add"
```

---

## Step 3: Copy DNS Records (1 minute)
Resend will show you records like this:

```
📋 COPY THESE RECORDS:

Record 1:
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb... (long string)

Record 2:
Type: MX
Name: @
Value: feedback-smtp.resend.com
Priority: 10
```

---

## Step 4: Add to Your Domain Registrar (5 minutes)

### If using GoDaddy:
```
1. Login to GoDaddy.com
2. My Products → Domains → DNS
3. Click "Add" for each record
4. Paste values from Resend
5. Save
```

### If using Namecheap:
```
1. Login to Namecheap.com
2. Domain List → Manage → Advanced DNS
3. Add New Record for each
4. Paste values from Resend
5. Save
```

### If using Cloudflare:
```
1. Login to Cloudflare.com
2. Select domain → DNS
3. Add record for each
4. Paste values from Resend
5. Save
```

---

## Step 5: Wait & Verify (10-60 minutes)
```
1. Wait 10-60 minutes for DNS to update
2. Go back to Resend dashboard
3. Click "Verify" next to your domain
4. ✅ Should say "Domain Verified"
```

---

## Step 6: Update Your Code (1 minute)

Edit `.env.local`:
```env
FROM_EMAIL=orders@6six9ine.com
ADMIN_EMAIL=admin@6six9ine.com
```

Restart server:
```bash
npm run dev
```

---

## Step 7: Test (2 minutes)
```
1. Place test order with different email
2. Approve payment in admin panel
3. Check if customer receives email
4. ✅ Success!
```

---

## Troubleshooting

### DNS Not Updating?
- Wait 24 hours (can take time)
- Check with: https://mxtoolbox.com/
- Clear DNS cache: `ipconfig /flushdns`

### Still Not Working?
- Check Resend dashboard logs
- Verify API key in `.env.local`
- Restart Next.js server
- Contact Resend support

---

## Don't Have a Domain?

### Option 1: Buy a Domain ($10-15/year)
- GoDaddy.com
- Namecheap.com
- Google Domains

### Option 2: Use Free Subdomain
- Freenom.com (free domains)
- Vercel domain (if hosting on Vercel)

### Option 3: Upgrade Resend (Not Needed)
- Free tier is enough for most stores
- 3,000 emails/month free

---

## Quick Checklist

- [ ] Login to Resend
- [ ] Add domain
- [ ] Copy DNS records
- [ ] Add to domain registrar
- [ ] Wait 10-60 minutes
- [ ] Click "Verify" in Resend
- [ ] Update `.env.local`
- [ ] Restart server
- [ ] Test with order
- [ ] ✅ Done!

---

## Need Help?

**Resend Support:**
- Email: support@resend.com
- Docs: https://resend.com/docs

**Domain Registrar Support:**
- GoDaddy: https://www.godaddy.com/help
- Namecheap: https://www.namecheap.com/support/

---

**Total Time: 30 minutes (including DNS wait time)**

**After this, customers will receive emails automatically! 🎉**
