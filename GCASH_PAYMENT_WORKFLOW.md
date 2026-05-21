# 💙 GCash Payment Workflow - Complete Guide

## 🎯 Overview

Your checkout system now uses a **manual GCash payment workflow** with proof of payment upload and admin verification.

---

## 🔄 Complete Payment Flow

### 1️⃣ Customer Side (Checkout Page)

#### Step 1: Fill Shipping Information
- Customer enters name, phone, address, city, province, postal code

#### Step 2: View GCash Payment Details
- **GCash QR Code** displayed (if admin uploaded one)
- **Account Name** shown
- **GCash Number** shown
- **Amount to Pay** shown

#### Step 3: Make Payment
Customer has 2 options:
- **Option 1:** Scan QR code with GCash app
- **Option 2:** Send money to GCash number manually

#### Step 4: Upload Proof of Payment
- Customer takes screenshot of GCash payment confirmation
- Uploads screenshot (JPG/PNG, max 5MB)
- Screenshot must show:
  - Transaction details
  - Amount paid
  - Reference number
  - Recipient name

#### Step 5: Submit Order
- Click "SUBMIT ORDER FOR VERIFICATION"
- Order is created with status: `pending_payment`
- Payment status: `pending_verification`
- Customer sees success message
- Cart is cleared

---

### 2️⃣ Admin Side (Admin Panel)

#### Step 1: View Pending Orders
- Go to Admin Panel → Orders tab
- See all orders with `pending_verification` payment status
- Orders show:
  - Order ID (e.g., ORD123ABC)
  - Customer name
  - Phone number
  - Total amount
  - Status badge

#### Step 2: Review Order Details
- Click on order to open details modal
- View:
  - Customer information
  - Shipping address
  - Order items (products, sizes, colors, quantities)
  - Total amount
  - **Proof of Payment screenshot**

#### Step 3: Verify Payment
Admin reviews the screenshot and checks:
- ✅ Amount matches order total
- ✅ Payment was sent to correct GCash number
- ✅ Screenshot is clear and legitimate
- ✅ Reference number is visible

#### Step 4: Approve or Reject

**If Payment is Valid:**
- Click **"✓ APPROVE PAYMENT"** button
- Payment status changes to: `verified`
- Order status changes to: `processing`
- Order is saved to Firebase
- Customer can be notified (future feature)

**If Payment is Invalid:**
- Click **"✗ REJECT PAYMENT"** button
- Payment status changes to: `rejected`
- Order status changes to: `cancelled`
- Order is saved to Firebase
- Customer can be notified (future feature)

---

## 📊 Order Status Flow

```
Customer Places Order
         ↓
Status: pending_payment
Payment Status: pending_verification
         ↓
Admin Reviews Proof of Payment
         ↓
    ┌─────────┴─────────┐
    ↓                   ↓
APPROVE             REJECT
    ↓                   ↓
Status: processing  Status: cancelled
Payment: verified   Payment: rejected
    ↓
Admin Processes Order
    ↓
Status: completed
```

---

## 🎨 Payment Status Badges

### Customer View:
- **Pending Payment** - Yellow badge
- **Payment Verified** - Green badge
- **Payment Rejected** - Red badge

### Admin View:
- **Pending Verification** - Yellow badge with action buttons
- **Verified** - Green badge (no buttons)
- **Rejected** - Red badge (no buttons)

---

## 🔥 Firebase Data Structure

### Order Document:
```javascript
{
  id: "auto-generated-firebase-id",
  orderId: "ORD123ABC",
  customerName: "John Doe",
  phone: "+63 912 345 6789",
  address: "123 Street, City, Province 1234",
  city: "Manila",
  province: "Metro Manila",
  postalCode: "1234",
  total: 2999,
  status: "pending_payment", // or "processing", "completed", "cancelled"
  paymentStatus: "pending_verification", // or "verified", "rejected"
  paymentMethod: "gcash",
  proofOfPayment: "data:image/png;base64,...", // Base64 encoded image
  createdAt: "2026-05-18T12:00:00.000Z",
  updatedAt: "2026-05-18T12:00:00.000Z",
  items: [
    {
      name: "Product Name",
      slug: "product-slug",
      size: "L",
      color: "Black",
      quantity: 2,
      price: 999,
      image: "/images/product.jpg"
    }
  ]
}
```

---

## 🛠️ Admin GCash Settings

### How to Set Up GCash Details:

1. Go to Admin Panel → Settings tab
2. Scroll to "Payment Settings" section
3. Fill in:
   - **GCash Account Name** (e.g., "6SIX9INE CLOTHING")
   - **GCash Number** (e.g., "0912 345 6789")
   - **GCash QR Code** (optional - upload image)
4. Click "Save Profile"
5. Details are saved to Firebase
6. Customers will see these details on checkout page

---

## ✅ What Was Removed

- ❌ Cash on Delivery (COD)
- ❌ PayMaya payment option
- ❌ Bank Transfer option
- ❌ Email verification modal
- ❌ Automatic payment processing

---

## ✅ What Was Added

- ✅ GCash-only payment method
- ✅ QR code display on checkout
- ✅ Proof of payment upload
- ✅ Image preview before upload
- ✅ Admin approve/reject buttons
- ✅ Payment status tracking
- ✅ Clear payment instructions
- ✅ Firebase integration for all data

---

## 🧪 Testing the Workflow

### Test as Customer:

1. Add products to cart
2. Go to checkout
3. Fill in shipping information
4. View GCash payment details
5. Upload a test screenshot (any image)
6. Submit order
7. Check success message

### Test as Admin:

1. Login to admin panel
2. Go to Orders tab
3. Find the test order
4. Click to view details
5. See the uploaded screenshot
6. Click "APPROVE PAYMENT"
7. Verify status changes to "processing"
8. Check Firebase Console - order should be updated

---

## 🎯 Key Features

### Security:
- ✅ Manual verification prevents fraud
- ✅ Admin reviews every payment
- ✅ Screenshot proof required
- ✅ No automatic charges

### User Experience:
- ✅ Clear payment instructions
- ✅ QR code for easy payment
- ✅ Visual feedback (image preview)
- ✅ Status tracking
- ✅ Success/error messages

### Admin Control:
- ✅ Full control over payment approval
- ✅ View proof before approving
- ✅ Can reject suspicious payments
- ✅ All data saved to Firebase

---

## 📱 Customer Instructions (Shown on Checkout)

**HOW TO PAY:**

1. **Option 1:** Scan the QR code above using your GCash app
2. **Option 2:** Send ₱[amount] to [GCash number]
3. Take a screenshot of the payment confirmation
4. Upload the screenshot below
5. Submit your order

⚠️ Your order will be processed after admin verifies your payment

---

## 🔍 Admin Verification Checklist

When reviewing proof of payment, check:

- [ ] Screenshot shows GCash transaction
- [ ] Amount matches order total exactly
- [ ] Payment sent to correct GCash number
- [ ] Screenshot is clear and readable
- [ ] Reference number is visible
- [ ] Transaction date is recent
- [ ] No signs of editing/tampering

---

## 🚀 Next Steps (Future Enhancements)

### Possible Improvements:
1. **Email Notifications**
   - Send email when order is placed
   - Send email when payment is approved/rejected

2. **SMS Notifications**
   - Send SMS confirmation to customer
   - Send SMS when order status changes

3. **Customer Order Tracking**
   - Create customer dashboard
   - Show order history
   - Show payment status

4. **Automatic Reminders**
   - Remind admin of pending verifications
   - Remind customer to upload proof if missing

5. **Payment Analytics**
   - Track approval/rejection rates
   - Monitor payment processing time
   - Generate payment reports

---

## 💡 Tips for Smooth Operations

### For Customers:
- Take clear screenshots
- Include all transaction details
- Upload immediately after payment
- Keep reference number handy

### For Admin:
- Check orders regularly
- Verify payments promptly
- Keep GCash details updated
- Maintain clear QR code image
- Document rejection reasons

---

## 🎉 Summary

Your checkout now has a **complete manual GCash payment workflow**:

1. ✅ Customer pays via GCash
2. ✅ Customer uploads proof
3. ✅ Admin reviews proof
4. ✅ Admin approves or rejects
5. ✅ Order status updates
6. ✅ Everything saves to Firebase

**Simple, secure, and fully functional!** 🔥
