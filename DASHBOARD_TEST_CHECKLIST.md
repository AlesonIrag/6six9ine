# ✅ DASHBOARD TEST CHECKLIST

## 🧪 TESTING INSTRUCTIONS

### Prerequisites
1. Make sure dev server is running: `npm run dev`
2. Navigate to: `http://localhost:3000/admin`
3. Open browser console (F12) to check for errors

---

## 📋 TEST CASES

### ✅ 1. Dashboard Display
**Test**: Dashboard loads correctly
- [ ] Dashboard tab is active by default
- [ ] "DASHBOARD OVERVIEW" header is visible
- [ ] Two report buttons appear at top right
- [ ] No console errors on page load

**Expected Result**: Dashboard displays without errors

---

### ✅ 2. Main Stats Grid
**Test**: Four stat cards display correct data
- [ ] "Total Products" shows correct count
- [ ] "Total Revenue" shows ₱ amount
- [ ] "Pending Orders" shows count
- [ ] "Catalog Value" shows ₱ amount
- [ ] All cards have icons (📦, 💰, 🛒, 📊)
- [ ] Detail text shows under each value

**Expected Result**: All 4 cards display with accurate numbers

---

### ✅ 3. Catalog Value by Category
**Test**: Category breakdown displays correctly
- [ ] Section header "CATALOG VALUE BY CATEGORY" is visible
- [ ] At least one category card appears
- [ ] Each card shows:
  - [ ] Category name (TOPS, LONGSLEEVE, MASK, etc.)
  - [ ] Category icon (👕, 🧥, 😷)
  - [ ] Total Value in ₱
  - [ ] Product count
  - [ ] Total Quantity
  - [ ] In Stock count (green)
  - [ ] Out of Stock count (red)
- [ ] Cards are in a responsive grid
- [ ] Hover effect works (border changes to yellow, card lifts)

**Expected Result**: Category cards display with complete data

---

### ✅ 4. Order Statistics
**Test**: Order stats show correct breakdown
- [ ] Section header "ORDER STATISTICS" is visible
- [ ] Four stat boxes appear:
  - [ ] Completed Orders (green background)
  - [ ] Processing Orders (yellow background)
  - [ ] Pending Orders (red background)
  - [ ] Average Order (default background)
- [ ] Each shows count and revenue amount
- [ ] Colors match status (green/yellow/red)

**Expected Result**: Order stats display with color coding

---

### ✅ 5. Inventory Alerts
**Test**: Low stock and out of stock alerts work
- [ ] Section header "INVENTORY ALERTS" is visible
- [ ] Two alert boxes appear:
  - [ ] Low Stock Items (yellow background)
  - [ ] Out of Stock (red background)
- [ ] Low stock shows products with quantity ≤ 5
- [ ] Out of stock shows products with quantity = 0
- [ ] Product names appear as tags/chips
- [ ] Counts are accurate

**Expected Result**: Alerts show correct products

---

### ✅ 6. Inventory Report Generation
**Test**: Inventory report downloads correctly

**Steps:**
1. Click "📊 Inventory Report" button
2. Check for notification: "Inventory report downloaded!"
3. Check Downloads folder for file: `inventory-report-YYYY-MM-DD.csv`
4. Open CSV file

**Verify CSV Contains:**
- [ ] Headers: Product Name, Category, Price, Quantity, Total Value, Status, Featured, New Drop
- [ ] All products are listed
- [ ] Total Value = Price × Quantity
- [ ] Status shows "In Stock" or "Out of Stock"
- [ ] Featured/New Drop shows "Yes" or "No"
- [ ] No errors in console

**Expected Result**: CSV file downloads with correct data

---

### ✅ 7. Sales Report Generation
**Test**: Sales report downloads correctly

**Steps:**
1. Click "💰 Sales Report" button
2. Check for notification: "Sales report downloaded!"
3. Check Downloads folder for file: `sales-report-YYYY-MM-DD.csv`
4. Open CSV file

**Verify CSV Contains:**
- [ ] Headers: Order ID, Customer, Email, Phone, Total, Status, Payment Method, Date
- [ ] All orders are listed
- [ ] Dates are formatted correctly
- [ ] All fields have data
- [ ] No errors in console

**Expected Result**: CSV file downloads with correct data

---

### ✅ 8. Calculation Accuracy
**Test**: Verify calculations are correct

**Manual Verification:**
1. Pick a product from catalog
2. Note its price and quantity
3. Calculate: Price × Quantity = Expected Value
4. Find product in category breakdown
5. Verify the value matches

**Example:**
```
Product: Skull Tee
Price: ₱500
Quantity: 10
Expected Value: ₱5,000

Check in TOPS category:
- Should contribute ₱5,000 to TOPS total value
- Should count as 1 product
- Should add 10 to total quantity
```

- [ ] Individual product values are correct
- [ ] Category totals are correct
- [ ] Overall catalog value is correct
- [ ] Revenue calculations are correct

**Expected Result**: All calculations match manual verification

---

### ✅ 9. Responsive Design
**Test**: Dashboard works on different screen sizes

**Desktop (>1200px):**
- [ ] 4 columns for main stats
- [ ] 3 columns for category cards
- [ ] All content visible

**Tablet (768px - 1200px):**
- [ ] 2 columns for main stats
- [ ] 2 columns for category cards
- [ ] No horizontal scroll

**Mobile (<768px):**
- [ ] 1 column layout
- [ ] Cards stack vertically
- [ ] Text is readable
- [ ] Buttons are tappable

**Expected Result**: Layout adapts to screen size

---

### ✅ 10. Real-time Updates
**Test**: Dashboard updates when data changes

**Steps:**
1. Note current "Total Products" count
2. Go to "Products" tab
3. Add a new product
4. Return to "Dashboard" tab
5. Check if "Total Products" increased

- [ ] Product count updates
- [ ] Catalog value updates
- [ ] Category breakdown updates
- [ ] No page refresh needed

**Expected Result**: Dashboard reflects changes immediately

---

## 🐛 COMMON ISSUES & FIXES

### Issue: "Cannot read property 'length' of undefined"
**Fix**: Make sure products and orders are loaded
```javascript
// Check in console:
console.log('Products:', products.length);
console.log('Orders:', orders.length);
```

### Issue: Category cards not showing
**Fix**: Make sure products have category field
```javascript
// Check product structure:
console.log('Product:', products[0]);
// Should have: { category: 'tops', ... }
```

### Issue: CSV download not working
**Fix**: Check browser console for errors
- Make sure Blob API is supported
- Check if download was blocked by browser

### Issue: Calculations seem wrong
**Fix**: Verify product data
```javascript
// Check product quantities:
products.forEach(p => {
  console.log(p.name, 'Qty:', p.quantity, 'Price:', p.price);
});
```

---

## 📊 SAMPLE TEST DATA

### Expected Values (with sample data):
```
Total Products: 15
In Stock: 12
Out of Stock: 3
Low Stock: 5 (items with qty ≤ 5)

Categories:
- TOPS: 8 products, ₱65,000 value
- LONGSLEEVE: 5 products, ₱45,000 value
- MASK: 2 products, ₱10,000 value

Orders:
- Completed: 10 orders, ₱45,000
- Processing: 2 orders, ₱6,500
- Pending: 3 orders, ₱8,500
- Average: ₱4,500 per order

Total Catalog Value: ₱120,000
Total Revenue: ₱45,000
```

---

## ✅ FINAL VERIFICATION

### All Tests Passed?
- [ ] Dashboard displays correctly
- [ ] All sections are visible
- [ ] Calculations are accurate
- [ ] Reports download successfully
- [ ] No console errors
- [ ] Responsive design works
- [ ] Real-time updates work

### If All Checked:
**🎉 DASHBOARD IS PRODUCTION READY! 🎉**

---

## 📝 NOTES

### Browser Compatibility
- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ IE11 (Not supported)

### Performance
- Dashboard loads in <1 second
- Report generation is instant
- No lag when switching tabs

### Data Persistence
- All data is stored in Firebase
- Dashboard reads from Firebase on load
- Changes are saved automatically

---

## 🆘 NEED HELP?

### Check Console Logs
Look for these messages:
```
🚀 Products loaded from Firebase: 15
🚀 Admin: Orders loaded from Firebase: 15
✅ Product saved to Firebase immediately
```

### Verify Firebase Connection
```javascript
// In browser console:
fetch('/api/products')
  .then(r => r.json())
  .then(d => console.log('Products:', d.length));

fetch('/api/orders')
  .then(r => r.json())
  .then(d => console.log('Orders:', d.length));
```

---

**Last Updated**: May 21, 2026  
**Status**: Ready for Testing ✅
