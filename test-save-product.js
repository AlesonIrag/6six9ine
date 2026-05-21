// Test saving a product directly to Firebase
// Run with: node test-save-product.js

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCG7qYZaAPyP2GAqyX3ZmG5eg49opBGc6o",
  authDomain: "six9ine-ec11e.firebaseapp.com",
  projectId: "six9ine-ec11e",
  storageBucket: "six9ine-ec11e.firebasestorage.app",
  messagingSenderId: "362446885878",
  appId: "1:362446885878:web:746c103c8080f4080c6dd7",
};

async function testSaveProduct() {
  console.log('🧪 Testing Product Save to Firebase...\n');
  
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log('✅ Firebase initialized');
    
    // Test product data
    const testProducts = [
      {
        slug: 'test-product',
        name: 'Test Product',
        category: 'tops',
        price: 999,
        description: 'This is a test product',
        images: [],
        sizes: ['M', 'L'],
        quantity: 10,
        inStock: true,
        featured: false,
        isNewDrop: false,
        createdAt: new Date().toISOString()
      }
    ];
    
    // Save to Firestore
    console.log('💾 Saving test product to Firestore...');
    const productsRef = doc(db, 'settings', 'products');
    await setDoc(productsRef, {
      items: testProducts,
      updatedAt: new Date().toISOString()
    });
    console.log('✅ Product saved successfully!');
    
    // Read it back
    console.log('📖 Reading product back from Firestore...');
    const productsSnap = await getDoc(productsRef);
    
    if (productsSnap.exists()) {
      const data = productsSnap.data();
      console.log('✅ Product read successfully!');
      console.log('📦 Data:', JSON.stringify(data, null, 2));
      console.log('\n🎉 SUCCESS! Firebase is working correctly!');
      console.log('\n📋 Next steps:');
      console.log('   1. Go to Firebase Console');
      console.log('   2. Refresh the Data tab');
      console.log('   3. You should see a "settings" collection');
      console.log('   4. Click on it to see the "products" document');
    } else {
      console.log('❌ Could not read product back');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nFull error:', error);
    
    if (error.code === 'permission-denied') {
      console.log('\n🔒 PERMISSION DENIED!');
      console.log('   Check Firebase security rules');
    } else if (error.code === 'not-found') {
      console.log('\n❌ NOT FOUND!');
      console.log('   Make sure Firestore is enabled');
    }
  }
  
  process.exit(0);
}

testSaveProduct();
