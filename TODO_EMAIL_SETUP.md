# ✅ EMAIL SETUP TODO LIST

## 🎯 Quick Setup (5 Minutes)

### Step 1: Get Resend API Key
- [ ] Go to https://resend.com
- [ ] Sign up for free account
- [ ] Navigate to "API Keys" section
- [ ] Click "Create API Key"
- [ ] Copy the API key (starts with `re_`)

### Step 2: Update Environment Variables
- [ ] Open `.env.local` file
- [ ] Replace `your_resend_api_key_here` with your actual API key
- [ ] Replace `admin@6six9ine.com` with your actual email
- [ ] Save the file

### Step 3: Restart Server
- [ ] Stop the server (Ctrl+C in terminal)
- [ ] Run `npm run dev` again
- [ ] Wait for server to start

### Step 4: Test Email System
- [ ] Go to your website
- [ ] Add items to cart
- [ ] Go to checkout
- [ ] Fill in form with YOUR email address
- [ ] Upload a test screenshot
- [ ] Submit order
- [ ] Check your email inbox (and spam folder)
- [ ] Verify you received 2 emails:
  - [ ] Admin notification
  - [ ] Customer confirmation

### Step 5: Test Admin Actions
- [ ] Login to admin panel
- [ ] Go to Orders tab
- [ ] Click on the test order
- [ ] Click "✓ APPROVE PAYMENT"
- [ ] Check your email for approval notification
- [ ] Place another test order
- [ ] Click "✗ REJECT PAYMENT" on new order
- [ ] Check your email for rejection notification
- [ ] Verify stock was restored

---

## 🚀 Before Going Live

### Pre-Deployment Checklist
- [ ] All tests passed
- [ ] Emails arriving in inbox (not spam)
- [ ] Email content looks professional
- [ ] Order flow works end-to-end
- [ ] Stock management working correctly

### Vercel Deployment
- [ ] Add environment variables to Vercel:
  - [ ] `RESEND_API_KEY`
  - [ ] `ADMIN_EMAIL`
  - [ ] `FROM_EMAIL`
- [ ] Deploy to Vercel
- [ ] Test on production URL
- [ ] Update admin panel URL in `src/lib/email.js`

### Optional (For Better Deliverability)
- [ ] Verify custom domain in Resend
- [ ] Update `FROM_EMAIL` to use custom domain
- [ ] Test emails from production

---

## 📝 Configuration Values

```env
# Copy these to your .env.local
RESEND_API_KEY=re_your_key_here
ADMIN_EMAIL=your-email@gmail.com
FROM_EMAIL=onboarding@resend.dev
```

---

## 🆘 If Something Goes Wrong

### Emails Not Sending?
1. [ ] Check if `RESEND_API_KEY` is set correctly
2. [ ] Verify API key starts with `re_`
3. [ ] Restart the server
4. [ ] Check browser console for errors
5. [ ] Check Resend dashboard for logs

### Emails Going to Spam?
1. [ ] Check spam/junk folder
2. [ ] Mark as "Not Spam"
3. [ ] For production, verify custom domain

### Server Not Starting?
1. [ ] Check for syntax errors in `.env.local`
2. [ ] Make sure no extra spaces in values
3. [ ] Verify file is saved

---

## 📚 Documentation Files

- `EMAIL_SETUP_COMPLETE.md` - Full documentation
- `QUICK_EMAIL_SETUP.md` - Quick start guide
- `IMPLEMENTATION_SUMMARY.md` - Technical details
- `TODO_EMAIL_SETUP.md` - This checklist

---

## ✅ When Everything Works

You should see:
- ✅ Orders being placed successfully
- ✅ Admin receiving order notifications
- ✅ Customers receiving confirmations
- ✅ Approval emails being sent
- ✅ Rejection emails being sent
- ✅ Stock being managed correctly

---

## 🎉 You're Done!

Once all checkboxes are ticked, your email system is fully operational!

**Time Required:** 5-10 minutes
**Difficulty:** Easy
**Result:** Professional email notifications

---

**Need Help?** Check the documentation files or console logs for errors.
