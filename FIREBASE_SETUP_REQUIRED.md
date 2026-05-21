# 🔥 Firebase Setup Required

## ❌ Current Issue

The error `Code: 5 Message: 5 NOT_FOUND` means your Firestore database hasn't been initialized yet in the Firebase Console.

## ✅ Solution: Enable Firestore Database

### **Step 1: Go to Firebase Console**

1. Open your browser and go to: https://console.firebase.google.com/
2. Select your project: **six9ine-ec11e**

### **Step 2: Enable Firestore Database**

1. In the left sidebar, click **"Build"** → **"Firestore Database"**
2. Click **"Create database"** button
3. Choose a location:
   - **Recommended**: `asia-southeast1` (Singapore) - closest to Philippines
   - Or: `us-central1` (Iowa) - default option
4. Select **"Start in test mode"** (for development)
   - This allows read/write access for 30 days
   - We'll add security rules later
5. Click **"Enable"**

Wait 1-2 minutes for Firestore to be provisioned.

### **Step 3: Verify Firestore is Active**

1. You should see the Firestore Database interface
2. It will be empty (no collections yet)
3. This is normal - collections will be created automatically when you save data

### **Step 4: Configure Security Rules (Important!)**

1. In Firestore Database, click the **"Rules"** tab
2. Replace the default rules with these:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read settings (products, story, blog, profile)
    match /settings/{document=**} {
      allow read: if true;
      allow write: if true; // Change to 'if request.auth != null' in production
    }
    
    // Allow anyone to create orders (customers placing orders)
    match /orders/{orderId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if true; // Change to 'if request.auth != null' in production
    }
  }
}
```

3. Click **"Publish"**

**Note**: These rules allow public access for development. In production, you should:
- Add Firebase Authentication
- Restrict write access to authenticated admin users only

### **Step 5: Test Again**

Now run the test script again:

```bash
node test-firebase.js
```

You should see:
```
✅ Firebase initialized successfully
✅ Write test successful
✅ Read test successful
🎉 Firebase is working perfectly!
```

### **Step 6: Start Your Application**

```bash
npm run dev
```

Go to `http://localhost:3000/admin` and:
1. Login with: `admin@6six9ine.com` / `admin123`
2. Add a product or update story content
3. Check Firebase Console - you should see new collections appear!

---

## 🗄️ Expected Firestore Structure (After First Use)

After you start using the app, Firestore will automatically create:

```
📁 Firestore Database
├── 📁 orders (collection)
│   └── 📄 [auto-generated-id] (documents created when customers place orders)
│
└── 📁 settings (collection)
    ├── 📄 products (created when admin saves products)
    ├── 📄 profile (created when admin updates profile)
    ├── 📄 story (created when admin saves story)
    └── 📄 blog (created when admin saves blog posts)
```

---

## 🔒 Production Security Rules (Use Later)

When you're ready to deploy, update security rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for settings
    match /settings/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Orders: customers can create, only admin can update/delete
    match /orders/{orderId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

Then implement Firebase Authentication for admin login.

---

## 🐛 Still Having Issues?

### **Check 1: Firebase Project Status**
- Go to Firebase Console
- Make sure project is active (not deleted or suspended)
- Check billing status (free tier should be fine for development)

### **Check 2: API Key**
- In Firebase Console, go to **Project Settings** (gear icon)
- Scroll to **"Your apps"** section
- Verify the API key matches what's in your `.env.local` file

### **Check 3: Internet Connection**
- Firebase requires internet connection
- Check if you can access https://firebase.google.com

### **Check 4: Firestore Location**
- Once Firestore is created, the location cannot be changed
- Make sure you selected a location close to your users

---

## 📞 Need Help?

If you're still seeing errors after enabling Firestore:

1. Share a screenshot of your Firebase Console (Firestore Database page)
2. Share the exact error message from the terminal
3. Check browser console (F12) for additional error details

---

## ✅ Quick Checklist

- [ ] Firestore Database is enabled in Firebase Console
- [ ] Security rules are set to "test mode" or custom rules above
- [ ] `.env.local` has correct Firebase credentials
- [ ] Internet connection is working
- [ ] `node test-firebase.js` runs successfully
- [ ] `npm run dev` starts without errors
- [ ] Can login to admin panel
- [ ] Can save data (products, story, etc.)
- [ ] Data appears in Firebase Console

Once all checkboxes are complete, your Firebase backend is fully operational! 🎉
