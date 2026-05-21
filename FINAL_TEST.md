# 🧪 FINAL TEST CHECKLIST

## ✅ Migration Complete - Ready to Test!

All API routes have been updated to use Firebase Firestore REST API. The system is now ready for testing.

---

## 🎯 Quick Test Steps

### 1️⃣ Start the Server (if not running)
```bash
npm run dev
```

### 2️⃣ Test Product Save
1. Open `http://localhost:3000/admin`
2. Login: `admin@6six9ine.com` / `admin123`
3. Click **"Products"** tab
4. Click **"Add New Product"** button
5. Fill in:
   - Name: "Test Product"
   - Slug: "test-product"
   - Price: 999
   - Category: "Shirts"
   - Add at least one image
6. Click **"Save"**
7. **Watch terminal logs** - You should see:
   ```
   📤 [Firestore REST] SET settings/products
   ✅ [Firestore REST] SET successful
   ✅ [API] POST /api/products - Successfully saved X products to Firebase
   ```

### 3️⃣ Verify in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **six9ine-ec11e**
3. Click **"Firestore Database"** in left menu
4. You should see:
   - Collection: `settings`
   - Document: `products`
   - Field: `items` (array with your products)

---

## 🔍 What to Look For

### ✅ Success Indicators:
- Green success alert in admin panel
- Terminal shows `✅ [Firestore REST] SET successful`
- Data appears in Firebase Console
- Product appears in shop page immediately

### ❌ Error Indicators:
- Red error alert in admin panel
- Terminal shows `❌ [Firestore REST] SET failed`
- No data in Firebase Console
- Check terminal for detailed error message

---

## 📊 All Features to Test

### Products ✅
- [ ] Add new product → Saves to Firebase
- [ ] Edit existing product → Updates in Firebase
- [ ] Delete product → Removes from Firebase
- [ ] Toggle featured → Updates in Firebase
- [ ] Toggle stock → Updates in Firebase

### Orders ✅
- [ ] Complete checkout → Creates order in Firebase
- [ ] View orders in admin → Loads from Firebase
- [ ] Update order status → Updates in Firebase

### Story Content ✅
- [ ] Edit story sections → Saves to Firebase
- [ ] Add new section → Saves to Firebase
- [ ] Delete section → Updates in Firebase

### Blog Posts ✅
- [ ] Add blog post → Saves to Firebase
- [ ] Edit blog post → Updates in Firebase
- [ ] Delete blog post → Updates in Firebase

### Payment Settings ✅
- [ ] Update GCash info → Saves to Firebase
- [ ] Update PayMaya info → Saves to Firebase
- [ ] Update Bank info → Saves to Firebase

---

## 🐛 Common Issues & Solutions

### Issue: "Document not found"
**Solution:** This is normal for first-time use. Just save data and it will create the document.

### Issue: "Failed to save"
**Solution:** 
1. Check terminal for detailed error
2. Verify `.env.local` has correct credentials
3. Check Firestore is enabled in Firebase Console

### Issue: Data doesn't appear in Firebase Console
**Solution:**
1. Refresh Firebase Console page
2. Check you're looking at correct project (six9ine-ec11e)
3. Check terminal logs for actual save confirmation

### Issue: "403 Forbidden"
**Solution:**
1. Go to Firebase Console → Firestore Database → Rules
2. Make sure rules allow read/write (for testing):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

## 📝 Terminal Log Examples

### Successful Product Save:
```
📤 [API] POST /api/products - Starting save operation...
📦 [API] Received 5 products to save
🔥 [API] Calling Firestore REST API...
📤 [Firestore REST] SET settings/products
📦 [Firestore REST] Data keys: items, updatedAt
✅ [Firestore REST] SET successful
✅ [API] POST /api/products - Successfully saved 5 products to Firebase
🎉 [API] Data should now be visible in Firebase Console
```

### Successful Order Creation:
```
📤 [API] POST /api/orders - Creating new order...
📤 [Firestore REST] ADD to orders
✅ [Firestore REST] ADD successful
✅ [API] POST /api/orders - Order created with ID: abc123xyz
```

---

## 🎉 Expected Results

After adding a product, you should see:

1. **Admin Panel**: Green success message
2. **Terminal**: Multiple ✅ success logs
3. **Firebase Console**: Data in `settings/products`
4. **Shop Page**: Product appears immediately
5. **No Errors**: No red ❌ logs in terminal

---

## 🚀 Ready to Test!

Everything is set up and ready. Just follow the test steps above and watch the magic happen! 🎊

**Start with adding one product and verify it appears in Firebase Console.**
