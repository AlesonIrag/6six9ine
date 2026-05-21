# 🚀 QUICK EMAIL SETUP GUIDE

## ⚡ 3-Minute Setup

### Step 1: Get Resend API Key (2 minutes)
1. Go to https://resend.com
2. Sign up (free)
3. Create API Key
4. Copy the key (starts with `re_`)

### Step 2: Update .env.local (1 minute)
```env
RESEND_API_KEY=re_your_actual_key_here
ADMIN_EMAIL=your-email@gmail.com
FROM_EMAIL=onboarding@resend.dev
```

### Step 3: Restart Server
```bash
# Press Ctrl+C to stop
npm run dev
```

## ✅ Done! Test it:
1. Place an order with your email
2. Check your inbox (and spam folder)
3. You should receive 2 emails:
   - Admin notification
   - Customer confirmation

---

## 📧 Email Flow

**Order Placed:**
- Admin gets notified ✉️
- Customer gets confirmation ✉️

**Admin Approves:**
- Customer gets "Payment Approved" email ✉️

**Admin Rejects:**
- Customer gets "Payment Rejected" email ✉️
- Stock restored automatically 📦

---

## 🔧 Environment Variables Needed

```env
RESEND_API_KEY=your_key_here
ADMIN_EMAIL=your_admin_email@gmail.com
FROM_EMAIL=onboarding@resend.dev
```

---

## 🚨 Troubleshooting

**Emails not sending?**
1. Check if RESEND_API_KEY is set
2. Restart the server
3. Check browser console for errors
4. Check spam folder

**Still not working?**
- Verify API key is correct
- Make sure .env.local is in root folder
- Check Resend dashboard for logs

---

## 📝 For Production (Vercel)

Add these environment variables in Vercel:
1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Add:
   - `RESEND_API_KEY`
   - `ADMIN_EMAIL`
   - `FROM_EMAIL`

---

## 🎯 That's It!

Your email system is ready to use. Just add your Resend API key and you're good to go!

For detailed documentation, see: `EMAIL_SETUP_COMPLETE.md`
