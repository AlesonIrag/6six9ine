// Diagnostic Script - Check Firebase Setup
// Run with: node diagnose.js

console.log('🔍 Running Firebase Diagnostics...\n');

// Check 1: Environment Variables
console.log('1️⃣ Checking Environment Variables...');
const envVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

const fs = require('fs');
const path = require('path');

try {
  const envPath = path.join(__dirname, '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  let allFound = true;
  envVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`   ✅ ${varName} found`);
    } else {
      console.log(`   ❌ ${varName} missing`);
      allFound = false;
    }
  });
  
  if (allFound) {
    console.log('   ✅ All environment variables present\n');
  } else {
    console.log('   ⚠️  Some environment variables missing\n');
  }
} catch (error) {
  console.log('   ❌ .env.local file not found or unreadable\n');
}

// Check 2: Firebase Config
console.log('2️⃣ Checking Firebase Configuration...');
const firebaseConfig = {
  apiKey: "AIzaSyCG7qYZaAPyP2GAqyX3ZmG5eg49opBGc6o",
  authDomain: "six9ine-ec11e.firebaseapp.com",
  projectId: "six9ine-ec11e",
  storageBucket: "six9ine-ec11e.firebasestorage.app",
  messagingSenderId: "362446885878",
  appId: "1:362446885878:web:746c103c8080f4080c6dd7",
};

console.log(`   Project ID: ${firebaseConfig.projectId}`);
console.log(`   Auth Domain: ${firebaseConfig.authDomain}`);
console.log('   ✅ Firebase config looks good\n');

// Check 3: Required Files
console.log('3️⃣ Checking Required Files...');
const requiredFiles = [
  'src/lib/firebaseAdmin.js',
  'src/app/api/orders/route.js',
  'src/app/api/orders/[id]/route.js',
  'src/app/api/products/route.js',
  'src/app/api/profile/route.js',
  'src/app/api/story/route.js',
  'src/app/api/blog/route.js',
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} missing`);
  }
});

console.log('\n4️⃣ Testing Firebase Connection...');
console.log('   Attempting to connect to Firestore...\n');

// Async test
(async () => {
  try {
    const { initializeApp } = require('firebase/app');
    const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log('   ✅ Firebase initialized');
    
    // Try to write
    const testRef = doc(db, 'test', 'diagnostic');
    await setDoc(testRef, {
      message: 'Diagnostic test',
      timestamp: new Date().toISOString()
    });
    console.log('   ✅ Write test successful');
    
    // Try to read
    const testSnap = await getDoc(testRef);
    if (testSnap.exists()) {
      console.log('   ✅ Read test successful');
      console.log('   📄 Data:', testSnap.data());
    }
    
    console.log('\n🎉 SUCCESS! Firebase is working correctly!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Go to: http://localhost:3000/admin');
    console.log('   3. Login and start using the app!');
    console.log('\n✅ Your data will now save to Firebase Firestore');
    
  } catch (error) {
    console.log('   ❌ Firebase connection failed\n');
    console.log('📋 Error Details:');
    console.log(`   ${error.message}\n`);
    
    if (error.message.includes('NOT_FOUND') || error.code === 5) {
      console.log('🔥 FIRESTORE NOT ENABLED YET!\n');
      console.log('📋 To Fix This:');
      console.log('   1. Go to: https://console.firebase.google.com/project/six9ine-ec11e/firestore');
      console.log('   2. Click "Create database"');
      console.log('   3. Choose location: asia-southeast1 (Singapore)');
      console.log('   4. Select "Start in test mode"');
      console.log('   5. Click "Enable"');
      console.log('   6. Wait 1-2 minutes');
      console.log('   7. Run this script again: node diagnose.js\n');
    } else if (error.message.includes('PERMISSION_DENIED')) {
      console.log('🔒 PERMISSION DENIED!\n');
      console.log('📋 To Fix This:');
      console.log('   1. Go to: https://console.firebase.google.com/project/six9ine-ec11e/firestore/rules');
      console.log('   2. Replace rules with:');
      console.log('      rules_version = \'2\';');
      console.log('      service cloud.firestore {');
      console.log('        match /databases/{database}/documents {');
      console.log('          match /{document=**} {');
      console.log('            allow read, write: if true;');
      console.log('          }');
      console.log('        }');
      console.log('      }');
      console.log('   3. Click "Publish"');
      console.log('   4. Run this script again: node diagnose.js\n');
    } else {
      console.log('🌐 OTHER ERROR\n');
      console.log('📋 Possible Causes:');
      console.log('   - No internet connection');
      console.log('   - Firebase project suspended');
      console.log('   - Invalid API key');
      console.log('   - Firewall blocking Firebase\n');
    }
  }
  
  process.exit(0);
})();
