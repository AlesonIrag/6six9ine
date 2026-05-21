// Quick Firebase Connection Test
// Run with: node test-firebase.js

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

async function testFirebase() {
  console.log('🔥 Testing Firebase Connection...\n');
  
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log('✅ Firebase initialized successfully');
    
    // Test write
    const testRef = doc(db, 'test', 'connection');
    await setDoc(testRef, {
      message: 'Firebase connection test',
      timestamp: new Date().toISOString()
    });
    console.log('✅ Write test successful');
    
    // Test read
    const testSnap = await getDoc(testRef);
    if (testSnap.exists()) {
      console.log('✅ Read test successful');
      console.log('📄 Data:', testSnap.data());
    }
    
    console.log('\n🎉 Firebase is working perfectly!');
    console.log('You can now start the dev server with: npm run dev');
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error.message);
    console.error('\nPlease check:');
    console.error('1. Firebase credentials in .env.local');
    console.error('2. Internet connection');
    console.error('3. Firebase project is active');
  }
  
  process.exit(0);
}

testFirebase();
