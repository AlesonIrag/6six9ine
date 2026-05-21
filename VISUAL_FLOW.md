# 📊 VISUAL FLOW DIAGRAM

## 🛒 Complete Order Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        CUSTOMER JOURNEY                          │
└─────────────────────────────────────────────────────────────────┘

1. BROWSE SHOP
   └─> Add products to cart
       └─> Click "Checkout"

2. CHECKOUT PAGE
   ├─> Fill Shipping Information
   │   ├─ First Name
   │   ├─ Last Name
   │   ├─ Phone Number
   │   ├─ Address
   │   ├─ City
   │   ├─ Province
   │   └─ Postal Code
   │
   ├─> View GCash Payment Details
   │   ├─ 💙 GCash QR Code (if available)
   │   ├─ Account Name: "6SIX9INE CLOTHING"
   │   ├─ GCash Number: "0912 345 6789"
   │   └─ Amount to Pay: ₱2,999
   │
   ├─> Make Payment
   │   ├─ Option 1: Scan QR code with GCash app
   │   └─ Option 2: Send money to GCash number
   │
   ├─> Upload Proof of Payment
   │   ├─ Take screenshot of GCash confirmation
   │   ├─ Click "UPLOAD SCREENSHOT"
   │   ├─ Select image file
   │   └─ See preview
   │
   └─> Submit Order
       └─> Click "SUBMIT ORDER FOR VERIFICATION"

3. ORDER CREATED
   ├─ Order ID: ORD123ABC
   ├─ Status: pending_payment
   ├─ Payment Status: pending_verification
   ├─ Proof: Screenshot saved
   └─ Saved to Firebase ✅

4. SUCCESS MESSAGE
   ├─> "Order placed successfully!"
   ├─> "Your payment is being verified"
   ├─> Cart cleared
   └─> Redirected to homepage


┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN JOURNEY                            │
└─────────────────────────────────────────────────────────────────┘

1. LOGIN TO ADMIN
   └─> Email: admin@6six9ine.com
       └─> Password: admin123

2. VIEW ORDERS
   └─> Click "Orders" tab
       └─> See all orders with status badges
           ├─ 🟡 pending_verification (needs action)
           ├─ 🟢 verified (approved)
           └─ 🔴 rejected (declined)

3. REVIEW ORDER
   └─> Click on order
       └─> Modal opens showing:
           ├─ Order ID: ORD123ABC
           ├─ Customer: John Doe
           ├─ Phone: +63 912 345 6789
           ├─ Address: Full address
           ├─ Items: Product list with sizes/colors
           ├─ Total: ₱2,999
           └─ 📸 Proof of Payment (screenshot)

4. VERIFY PAYMENT
   └─> Admin checks screenshot:
       ├─ ✅ Amount matches?
       ├─ ✅ Sent to correct number?
       ├─ ✅ Screenshot is clear?
       └─ ✅ Transaction details visible?

5. MAKE DECISION
   │
   ├─> APPROVE ✓
   │   └─> Click "✓ APPROVE PAYMENT"
   │       ├─ Payment Status → verified
   │       ├─ Order Status → processing
   │       ├─ Saved to Firebase ✅
   │       └─ Green notification shown
   │
   └─> REJECT ✗
       └─> Click "✗ REJECT PAYMENT"
           ├─ Payment Status → rejected
           ├─ Order Status → cancelled
           ├─ Saved to Firebase ✅
           └─ Red notification shown

6. PROCESS ORDER
   └─> After approval:
       ├─ Prepare items for shipping
       ├─ Update status to "completed"
       └─ Contact customer if needed
```

---

## 🔄 Status Flow Diagram

```
ORDER LIFECYCLE:

Customer Places Order
         │
         ↓
┌────────────────────┐
│  pending_payment   │ ← Order just created
│ pending_verification│ ← Waiting for admin
└────────────────────┘
         │
         ↓
    Admin Reviews
         │
    ┌────┴────┐
    ↓         ↓
┌─────────┐ ┌─────────┐
│ APPROVE │ │ REJECT  │
└─────────┘ └─────────┘
    │         │
    ↓         ↓
┌──────────┐ ┌──────────┐
│processing│ │cancelled │
│ verified │ │ rejected │
└──────────┘ └──────────┘
    │
    ↓
┌──────────┐
│completed │ ← Order fulfilled
│ verified │
└──────────┘
```

---

## 💾 Firebase Data Flow

```
CUSTOMER SUBMITS ORDER
         │
         ↓
┌─────────────────────────────────────┐
│  POST /api/orders                   │
│  ├─ Order data                      │
│  ├─ Proof of payment (base64)      │
│  └─ Status: pending_verification    │
└─────────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  Firestore REST API                 │
│  addDocument('orders', orderData)   │
└─────────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  Firebase Firestore                 │
│  orders/[auto-generated-id]         │
│  ├─ orderId: "ORD123ABC"           │
│  ├─ customerName: "John Doe"       │
│  ├─ total: 2999                    │
│  ├─ status: "pending_payment"      │
│  ├─ paymentStatus: "pending_..."   │
│  ├─ proofOfPayment: "data:image..."│
│  └─ items: [...]                   │
└─────────────────────────────────────┘
         │
         ↓
ADMIN APPROVES/REJECTS
         │
         ↓
┌─────────────────────────────────────┐
│  PATCH /api/orders/[id]             │
│  ├─ paymentStatus: "verified"       │
│  └─ status: "processing"            │
└─────────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  Firestore REST API                 │
│  setDocument('orders', id, updates) │
└─────────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  Firebase Firestore (UPDATED)       │
│  orders/[same-id]                   │
│  ├─ paymentStatus: "verified" ✅    │
│  ├─ status: "processing" ✅         │
│  └─ updatedAt: "2026-05-18..." ✅   │
└─────────────────────────────────────┘
```

---

## 🎨 UI Components

```
CHECKOUT PAGE LAYOUT:

┌─────────────────────────────────────────────────────────┐
│                    CHECKOUT                             │
│                 Complete your order                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────┐  ┌──────────────────────┐    │
│  │  CHECKOUT FORM      │  │  ORDER SUMMARY       │    │
│  │                     │  │                      │    │
│  │  Contact Info       │  │  Product 1           │    │
│  │  ├─ Phone          │  │  ├─ Size: L          │    │
│  │                     │  │  ├─ Qty: 2           │    │
│  │  Shipping Address   │  │  └─ ₱1,998          │    │
│  │  ├─ First Name     │  │                      │    │
│  │  ├─ Last Name      │  │  Product 2           │    │
│  │  ├─ Address        │  │  └─ ₱999            │    │
│  │  ├─ City           │  │                      │    │
│  │  ├─ Province       │  │  ─────────────────   │    │
│  │  └─ Postal Code    │  │  Subtotal: ₱2,997   │    │
│  │                     │  │  Total:    ₱2,997   │    │
│  │  Payment Method     │  └──────────────────────┘    │
│  │  ┌───────────────┐ │                              │
│  │  │ 💙 GCash      │ │                              │
│  │  │ Payment       │ │                              │
│  │  └───────────────┘ │                              │
│  │                     │                              │
│  │  GCash Details      │                              │
│  │  ┌───────────────┐ │                              │
│  │  │   QR CODE     │ │                              │
│  │  │   [IMAGE]     │ │                              │
│  │  └───────────────┘ │                              │
│  │  Name: 6SIX9INE    │                              │
│  │  Number: 0912...   │                              │
│  │  Amount: ₱2,997    │                              │
│  │                     │                              │
│  │  Proof of Payment   │                              │
│  │  ┌───────────────┐ │                              │
│  │  │ 📷 UPLOAD     │ │                              │
│  │  │ SCREENSHOT    │ │                              │
│  │  └───────────────┘ │                              │
│  │                     │                              │
│  │  ┌───────────────┐ │                              │
│  │  │ SUBMIT ORDER  │ │                              │
│  │  │ FOR VERIFICATION│                              │
│  │  └───────────────┘ │                              │
│  └─────────────────────┘                              │
└─────────────────────────────────────────────────────────┘
```

```
ADMIN ORDER MODAL:

┌─────────────────────────────────────────────────────────┐
│  ORDER DETAILS - ORD123ABC                         [X]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Customer Information                                   │
│  ├─ Name: John Doe                                     │
│  ├─ Phone: +63 912 345 6789                           │
│  └─ Address: 123 Street, City, Province               │
│                                                         │
│  Order Items                                            │
│  ├─ Product 1 (Size: L, Color: Black) x2 = ₱1,998    │
│  └─ Product 2 (Size: M) x1 = ₱999                     │
│                                                         │
│  Total: ₱2,997                                         │
│                                                         │
│  ─────────────────────────────────────────────────     │
│                                                         │
│  📸 PROOF OF PAYMENT                                   │
│  ┌─────────────────────────────────────────────┐      │
│  │                                               │      │
│  │         [SCREENSHOT IMAGE]                    │      │
│  │                                               │      │
│  │     Click to view full size                   │      │
│  └─────────────────────────────────────────────┘      │
│                                                         │
│  ┌──────────────────┐  ┌──────────────────┐          │
│  │ ✓ APPROVE        │  │ ✗ REJECT         │          │
│  │   PAYMENT        │  │   PAYMENT        │          │
│  └──────────────────┘  └──────────────────┘          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Points

### For Customers:
1. **Only GCash** - No other payment options
2. **Proof Required** - Must upload screenshot
3. **Wait for Approval** - Admin verifies payment
4. **Clear Instructions** - Step-by-step guide shown

### For Admin:
1. **Review Every Payment** - Manual verification
2. **See Proof** - Screenshot displayed clearly
3. **Approve or Reject** - Simple button click
4. **Instant Update** - Changes save to Firebase

### Technical:
1. **REST API** - Direct Firebase communication
2. **No SDK Errors** - Works on server-side
3. **Real-time Sync** - Instant status updates
4. **Complete Audit Trail** - Everything in Firebase

---

## 🎉 Result

**Simple → Secure → Functional**

Customer pays → Uploads proof → Admin verifies → Order processed

**Everything works perfectly!** 🔥
