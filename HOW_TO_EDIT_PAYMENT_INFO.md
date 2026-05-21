# 📝 How to Edit Payment Information (GCash, Bank Transfer)

## ✅ This Feature is Already Built-In!

You can edit all payment information directly from the Admin Panel.

---

## 🎯 Step-by-Step Guide:

### 1. Login to Admin Panel
- Go to: http://localhost:3000/admin
- Enter your admin credentials

### 2. Click "Profile" Tab
- Look at the left sidebar
- Click on **"Profile"** (last option)

### 3. Edit Payment Information

You'll see these sections:

#### 📱 **GCASH ACCOUNT**
- **Account Name:** Your GCash account name
  - Example: "6SIX9INE CLOTHING"
- **GCash Number:** Your GCash mobile number
  - Example: "0912 345 6789"
- **QR Code:** Upload your GCash QR code image
  - Click "📷 Upload QR Code" button
  - Select your QR code image
  - Preview will appear
  - Can remove and re-upload anytime

#### 💳 **PAYMAYA ACCOUNT** (Optional)
- **Account Name:** Your PayMaya account name
- **PayMaya Number:** Your PayMaya mobile number

#### 🏦 **BANK ACCOUNT**
- **Bank Name:** Select from dropdown
  - BDO Unibank
  - BPI (Bank of the Philippine Islands)
  - Metrobank
  - Landbank
  - UnionBank
  - Security Bank
  - PNB (Philippine National Bank)
  - RCBC
  - Chinabank
  - EastWest Bank
- **Account Name:** Name on the bank account
- **Account Number:** Your bank account number

#### 📧 **ADMIN EMAIL**
- Your email address for receiving order notifications

### 4. Save Changes
- Scroll down to the bottom
- Click **"Save Payment Information"** button
- You'll see a success notification
- Changes are saved to Firebase

---

## 🎨 What Customers See:

When customers go to checkout, they will see:

### GCash Payment Section:
```
💙 GCASH PAYMENT DETAILS

[Your QR Code Image]
Scan to Pay

Account Name: [Your GCash Name]
GCash Number: [Your GCash Number]
Amount to Pay: ₱[Order Total]

📱 HOW TO PAY:
1. Scan the QR code above using your GCash app
2. Send ₱[amount] to [your number]
3. Take a screenshot of payment confirmation
4. Upload the screenshot below
5. Submit your order
```

### Bank Transfer Section (if enabled):
```
🏦 BANK TRANSFER DETAILS

Bank Name: [Your Bank]
Account Name: [Your Account Name]
Account Number: [Your Account Number]
Amount to Pay: ₱[Order Total]
```

---

## 💡 Tips:

### For GCash QR Code:
1. **Get your QR code:**
   - Open GCash app
   - Go to "Receive Money"
   - Take screenshot of your QR code
   - Save the image

2. **Upload to admin panel:**
   - Click "📷 Upload QR Code"
   - Select your QR code image
   - System will compress it automatically
   - Click "Save Payment Information"

3. **Best practices:**
   - Use clear, high-quality QR code image
   - Make sure QR code is scannable
   - Test by scanning with another phone

### For Bank Account:
- Double-check account number (no spaces)
- Use exact name as registered with bank
- Select correct bank from dropdown

---

## 🔄 How It Works:

```
Admin Panel (Profile Tab)
        ↓
    Edit Payment Info
        ↓
    Click "Save"
        ↓
    Saved to Firebase
        ↓
Checkout Page Automatically Updates
        ↓
Customers See New Info
```

---

## ✅ Current Default Values:

**GCash:**
- Name: 6SIX9INE CLOTHING
- Number: 0912 345 6789
- QR Code: (not uploaded yet)

**Bank:**
- Bank: BDO
- Account Name: 6SIX9INE CLOTHING
- Account Number: 1234567890

**Admin Email:**
- admin@6six9ine.com

**👉 You should update these with your REAL information!**

---

## 🧪 Testing:

After updating payment info:

1. **Test on checkout page:**
   - Add items to cart
   - Go to checkout
   - Verify your GCash info is displayed
   - Verify your QR code appears (if uploaded)

2. **Test QR code:**
   - Use another phone to scan the QR code
   - Make sure it opens GCash with correct details

3. **Verify bank details:**
   - Check if bank name, account name, and number are correct

---

## 🆘 Troubleshooting:

### Changes not showing on checkout?
- Make sure you clicked "Save Payment Information"
- Refresh the checkout page (Ctrl+F5)
- Check browser console for errors

### QR code not uploading?
- Make sure image is less than 5MB
- Use JPG or PNG format
- Try compressing the image first

### Can't see Profile tab?
- Make sure you're logged in as admin
- Check left sidebar for "Profile" option
- Try refreshing the page

---

## 📞 Need Help?

If you have issues:
1. Check browser console (F12) for errors
2. Verify you're logged in as admin
3. Make sure server is running
4. Check Firebase connection

---

## 🎉 That's It!

Your payment information editing system is **fully functional and ready to use!**

Just login to admin panel → Profile tab → Edit → Save!

**Last Updated:** May 20, 2026
