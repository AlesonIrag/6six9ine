# 🚀 QUICK REFERENCE CARD

## ⚡ Start Server
```bash
npm run dev
```
**URL:** `http://localhost:3000`

---

## 🔑 Admin Login
**URL:** `http://localhost:3000/admin`  
**Email:** `admin@6six9ine.com`  
**Password:** `admin123`

---

## ✅ What's Working

### Customer Side:
- ✅ Browse & shop products
- ✅ Add to cart (stock validated)
- ✅ GCash payment with QR code
- ✅ Upload proof of payment
- ✅ Order tracking with Order ID

### Admin Side:
- ✅ Manage products & stock
- ✅ View orders & proof of payment
- ✅ Approve/reject payments
- ✅ Auto stock restoration on reject
- ✅ GCash settings & QR code

---

## 🔄 Order Flow

### Customer:
1. Shop → Cart → Checkout
2. Fill email, phone, address
3. Upload GCash screenshot
4. Submit order
5. **Stock deducted immediately**

### Admin:
1. View order in admin panel
2. Check proof of payment
3. **Approve** → Stock stays deducted
4. **Reject** → Stock restored automatically

---

## 📊 Stock Management

**Add to Cart:** Stock validated  
**Order Placed:** Stock deducted  
**Payment Approved:** Stock stays deducted  
**Payment Rejected:** Stock restored  

---

## 🔥 Firebase

**Type:** Firestore (REST API)  
**Collections:**
- `settings/products` - All products
- `settings/profile` - GCash details
- `orders/[id]` - Customer orders

---

## 🐛 Troubleshooting

**Server won't start:**
```bash
npm install
npm run dev
```

**Firebase not saving:**
- Check `.env.local` has correct credentials
- Check Firebase Console → Firestore enabled

**Stock not updating:**
- Check browser console (F12)
- Check terminal logs

---

## 📚 Documentation

1. `SDK_VS_REST_API.md` - Why REST API
2. `FIREBASE_MIGRATION_COMPLETE.md` - Firebase setup
3. `GCASH_PAYMENT_WORKFLOW.md` - Payment process
4. `STOCK_VALIDATION_COMPLETE.md` - Stock system
5. `CHECKOUT_IMPROVEMENTS_COMPLETE.md` - Latest fixes
6. `FINAL_SUMMARY.md` - Complete overview

---

## 🎯 Key Features

✅ Real-time stock validation  
✅ GCash payment with QR  
✅ Proof of payment upload  
✅ Admin approval system  
✅ Auto stock management  
✅ Email collection  
✅ Order tracking  
✅ Firebase backend  

---

## 🎉 Status

**✅ PRODUCTION READY**

All features tested and working!
