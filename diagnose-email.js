// Diagnostic script to check email configuration
// Run with: node diagnose-email.js

console.log('🔍 Email Configuration Diagnostic\n');
console.log('═══════════════════════════════════════\n');

// Check if .env.local exists
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
console.log('1. Checking .env.local file...');
if (fs.existsSync(envPath)) {
  console.log('   ✅ .env.local exists');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasResendKey = envContent.includes('RESEND_API_KEY');
  const hasAdminEmail = envContent.includes('ADMIN_EMAIL');
  const hasFromEmail = envContent.includes('FROM_EMAIL');
  
  console.log('   ✅ RESEND_API_KEY:', hasResendKey ? 'Found' : '❌ Missing');
  console.log('   ✅ ADMIN_EMAIL:', hasAdminEmail ? 'Found' : '❌ Missing');
  console.log('   ✅ FROM_EMAIL:', hasFromEmail ? 'Found' : '❌ Missing');
  
  // Extract API key (first 10 chars only for security)
  const apiKeyMatch = envContent.match(/RESEND_API_KEY=(.+)/);
  if (apiKeyMatch) {
    const apiKey = apiKeyMatch[1].trim();
    console.log('   📋 API Key preview:', apiKey.substring(0, 10) + '...');
    console.log('   📋 API Key length:', apiKey.length);
  }
} else {
  console.log('   ❌ .env.local NOT FOUND!');
}

console.log('\n2. Checking Resend package...');
try {
  const { Resend } = require('resend');
  console.log('   ✅ Resend package installed');
  
  // Try to initialize
  const testKey = 're_test_key';
  const resend = new Resend(testKey);
  console.log('   ✅ Resend can be initialized');
} catch (error) {
  console.log('   ❌ Resend package error:', error.message);
  console.log('   💡 Run: npm install resend');
}

console.log('\n3. Testing with actual API key...');
require('dotenv').config({ path: '.env.local' });

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const FROM_EMAIL = process.env.FROM_EMAIL;

console.log('   📋 RESEND_API_KEY loaded:', !!RESEND_API_KEY);
console.log('   📋 ADMIN_EMAIL loaded:', ADMIN_EMAIL);
console.log('   📋 FROM_EMAIL loaded:', FROM_EMAIL);

if (!RESEND_API_KEY) {
  console.log('\n❌ CRITICAL: RESEND_API_KEY not loaded from .env.local');
  console.log('💡 Make sure .env.local is in the root directory');
  console.log('💡 Restart your dev server after adding the key');
  process.exit(1);
}

console.log('\n4. Testing Resend API...');
async function testResend() {
  try {
    const { Resend } = require('resend');
    const resend = new Resend(RESEND_API_KEY);
    
    console.log('   📧 Sending test email...');
    
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: '🧪 Test Email from Diagnostic Script',
      html: '<h1>Test Successful!</h1><p>If you receive this, your Resend configuration is working!</p>',
    });
    
    if (error) {
      console.log('\n❌ Resend API Error:');
      console.log('   Error object:', error);
      console.log('   Error type:', typeof error);
      console.log('   Error keys:', Object.keys(error));
      console.log('   Error JSON:', JSON.stringify(error, null, 2));
      
      if (error.message) {
        console.log('\n💡 Error message:', error.message);
      }
      
      if (error.statusCode === 401 || error.message?.includes('401')) {
        console.log('\n❌ INVALID API KEY!');
        console.log('💡 Go to https://resend.com/api-keys');
        console.log('💡 Generate a new API key');
        console.log('💡 Update .env.local with the new key');
      }
      
      if (error.statusCode === 429 || error.message?.includes('429')) {
        console.log('\n❌ RATE LIMIT EXCEEDED!');
        console.log('💡 Free tier: 100 emails/day, 3000/month');
        console.log('💡 Wait 24 hours or upgrade plan');
      }
      
      return;
    }
    
    console.log('\n✅ SUCCESS! Email sent!');
    console.log('   Email ID:', data.id);
    console.log('   📬 Check', ADMIN_EMAIL, 'inbox (and spam folder)');
    console.log('\n🎉 Your email configuration is working correctly!');
    
  } catch (error) {
    console.log('\n❌ Exception occurred:');
    console.log('   Error:', error.message);
    console.log('   Stack:', error.stack);
  }
}

testResend();
