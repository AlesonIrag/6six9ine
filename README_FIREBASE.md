# 🎯 Firebase Migration - Complete Guide

## 📋 Current Status

✅ **Code Migration**: COMPLETE  
❌ **Firebase Setup**: REQUIRED  
⏳ **Testing**: PENDING

---

## 🚨 IMPORTANT: You Need to Enable Firestore First!

The error you're seeing (`Code: 5 NOT_FOUND`) means **Firestore Database hasn't been created yet** in your Firebase project.

### **Quick Fix (5 minutes):**

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `six9ine-ec11e`
3. **Click**: Build → Firestore Database
4. **Click**: "Create database"
5. **Choose location**: `asia-southeast1` (Singapore - closest to Philippines)
6. **Select**: "Start in test mode"
7. **Click**: "Enable"
8. **Wait**: 1-2 minutes for setup

### **Set Security Rules:**

In Firestore → Rules tab, paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Click "Publish"

**Note**: These rules allow public access for development. We'll secure them later.

---

## 🎉 After Firestore is Enabled

### **Test Firebase Connection:**

```bash
node test-firebase.js
```

Expected output:
```
✅ Firebase initialized successfully
✅ Write test successful
✅ Read test successful
🎉 Firebase is working perfectly!
```

### **Start Development Server:**

```bash
npm run dev
```

### **Test the Application:**

1. **Customer Side:**
   - Go to `http://localhost:3000`
   - Browse products
   - Add to cart
   - Checkout and place order
   - ✅ Order should save to Firebase

2. **Admin Side:**
   - Go to `http://localhost:3000/admin`
   - Login: `admin@6six9ine.com` / `admin123`
   - Add/edit products
   - Update story content
   - Manage orders
   - ✅ All changes should save to Firebase

3. **Verify in Firebase Console:**
   - Go to Firestore Database
   - You should see collections: `orders`, `settings`
   - Click on documents to see your data

---

## 📁 What Was Changed

### **1. Backend (API Routes)**

Created 5 API routes that connect to Firebase:

- `/api/orders` - Order management
- `/api/orders/[id]` - Individual order operations
- `/api/products` - Product management
- `/api/profile` - Admin profile & payment settings
- `/api/story` - Story content management
- `/api/blog` - Blog post management

### **2. Frontend (React Components)**

Updated all pages to use Firebase API:

- ✅ Admin page - All save functions use API
- ✅ Product context - Loads/saves via API
- ✅ Checkout page - Creates orders via API
- ✅ Story page - Loads from API
- ✅ Blog pages - Load from API

### **3. Removed localStorage**

- ❌ No more `localStorage.setItem()`
- ❌ No more polling every 2 seconds
- ❌ No more manual sync code
- ✅ Firebase handles all data persistence

---

## 🗄️ Database Structure

```
Firestore Database
│
├── 📁 orders (collection)
│   └── 📄 [order-id-1]
│       ├── customerName: "John Doe"
│       ├── email: "john@example.com"
│       ├── items: [...]
│       ├── total: 2500
│       ├── paymentMethod: "gcash"
│       ├── paymentStatus: "pending"
│       ├── status: "pending"
│       └── createdAt: "2026-05-18..."
│
└── 📁 settings (collection)
    ├── 📄 products
    │   └── items: [array of all products]
    │
    ├── 📄 profile
    │   ├── gcashName: "6SIX9INE CLOTHING"
    │   ├── gcashNumber: "0912 345 6789"
    │   ├── gcashQR: "data:image/jpeg;base64,..."
    │   └── ...
    │
    ├── 📄 story
    │   ├── title: "OUR STORY"
    │   ├── sections: [...]
    │   └── ...
    │
    └── 📄 blog
        └── posts: [array of blog posts]
```

---

## 🔧 Configuration Files

### **`.env.local`** (Environment Variables)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCG7qYZaAPyP2GAqyX3ZmG5eg49opBGc6o
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=six9ine-ec11e.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=six9ine-ec11e
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=six9ine-ec11e.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=362446885878
NEXT_PUBLIC_FIREBASE_APP_ID=1:362446885878:web:746c103c8080f4080c6dd7
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-TQK4C34QRV
```

### **`src/lib/firebaseAdmin.js`** (Server-side Firebase)
- Initializes Firebase for API routes
- Uses environment variables
- Singleton pattern to prevent multiple instances

---

## 🎯 Benefits of Firebase

### **Before (localStorage):**
- ❌ Data only in browser
- ❌ Lost on clear cache
- ❌ No sync between devices
- ❌ Manual polling needed
- ❌ Not scalable

### **After (Firebase):**
- ✅ Cloud database
- ✅ Persistent storage
- ✅ Real-time sync
- ✅ Accessible anywhere
- ✅ Production-ready
- ✅ Automatic backups
- ✅ Scalable

---

## 🚀 Next Steps

### **Immediate (Required):**
1. ✅ Enable Firestore in Firebase Console
2. ✅ Set security rules to test mode
3. ✅ Run `node test-firebase.js`
4. ✅ Start dev server: `npm run dev`
5. ✅ Test admin and customer flows

### **Soon (Recommended):**
1. Add Firebase Authentication for admin
2. Update security rules for production
3. Add real-time listeners for instant updates
4. Migrate images to Firebase Storage
5. Add email notifications for orders

### **Later (Optional):**
1. Add Firebase Analytics
2. Add Firebase Cloud Functions
3. Add Firebase Hosting for deployment
4. Add Firebase Performance Monitoring

---

## 📚 Documentation

- **Firebase Setup**: `FIREBASE_SETUP_REQUIRED.md`
- **Migration Details**: `FIREBASE_MIGRATION_COMPLETE.md`
- **This Guide**: `README_FIREBASE.md`

---

## 🐛 Troubleshooting

### **Error: "Code: 5 NOT_FOUND"**
→ Firestore not enabled. Follow setup guide above.

### **Error: "Permission denied"**
→ Security rules too restrictive. Use test mode rules.

### **Error: "Network error"**
→ Check internet connection and Firebase project status.

### **Data not saving**
→ Check browser console (F12) and Network tab for API errors.

### **Images not displaying**
→ Check Firestore document size (1MB limit). Consider Firebase Storage.

---

## ✅ Checklist

Before considering migration complete:

- [ ] Firestore Database enabled in Firebase Console
- [ ] Security rules set to test mode
- [ ] `node test-firebase.js` passes
- [ ] Dev server starts without errors
- [ ] Can login to admin panel
- [ ] Can add/edit products
- [ ] Products appear on shop page
- [ ] Can place orders
- [ ] Orders appear in admin panel
- [ ] Can update order status
- [ ] Can approve/reject payments
- [ ] Can edit story content
- [ ] Story updates appear on story page
- [ ] Can add/edit blog posts
- [ ] Blog posts appear on blog page
- [ ] Can update admin profile
- [ ] Payment info updates on checkout
- [ ] All data visible in Firebase Console

---

## 🎉 Success Criteria

Your Firebase migration is complete when:

1. ✅ No localStorage code remains
2. ✅ All data saves to Firebase
3. ✅ Admin changes reflect on customer pages
4. ✅ Orders persist after browser refresh
5. ✅ Data visible in Firebase Console
6. ✅ No console errors
7. ✅ Smooth user experience

---

**Need help?** Check the error message, review the setup guide, and verify each step in the checklist above.
