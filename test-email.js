// Simple test script to verify Resend email is working
// Run with: node test-email.js

const { Resend } = require('resend');

// Your Resend API key from .env.local
const RESEND_API_KEY = 're_MPtdKLwS_EM4LuLSipnyx6VcNz6Kt2jEy';

// Initialize Resend
const resend = new Resend(RESEND_API_KEY);

async function testEmail() {
  console.log('🧪 Testing Resend Email Service...\n');
  
  try {
    console.log('📧 Sending test email...');
    
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'admin@6six9ine.com', // Change this to your email to test
      subject: '🧪 Test Email from 6SIX9INE System',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 30px; border-radius: 8px; }
            .header { background: #1a1a1a; color: #D4A843; padding: 20px; text-align: center; border-radius: 8px; }
            .content { padding: 20px; background: white; margin-top: 20px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Email Test Successful!</h1>
            </div>
            <div class="content">
              <p><strong>Congratulations!</strong></p>
              <p>If you're reading this, your Resend email service is working correctly!</p>
              <p><strong>Test Details:</strong></p>
              <ul>
                <li>API Key: Working ✅</li>
                <li>From Email: onboarding@resend.dev</li>
                <li>To Email: admin@6six9ine.com</li>
                <li>Time: ${new Date().toLocaleString()}</li>
              </ul>
              <p>Your 6SIX9INE email system is ready to send notifications!</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('\n❌ ERROR sending email:');
      console.error(error);
      console.log('\n🔍 Troubleshooting:');
      console.log('1. Check if API key is correct');
      console.log('2. Verify Resend account is active');
      console.log('3. Check rate limits (100 emails/day free tier)');
      return;
    }

    console.log('\n✅ SUCCESS! Email sent successfully!');
    console.log('\n📋 Email Details:');
    console.log(JSON.stringify(data, null, 2));
    console.log('\n📬 Check your inbox (and spam folder) for the test email!');
    console.log('📧 Sent to: admin@6six9ine.com');
    console.log('\n💡 If you don\'t see it:');
    console.log('1. Check spam/junk folder');
    console.log('2. Wait 1-2 minutes for delivery');
    console.log('3. Check Resend dashboard: https://resend.com/emails');
    
  } catch (error) {
    console.error('\n❌ EXCEPTION occurred:');
    console.error(error);
    console.log('\n🔍 Possible issues:');
    console.log('1. Resend package not installed (run: npm install resend)');
    console.log('2. Invalid API key');
    console.log('3. Network connection issue');
  }
}

// Run the test
console.log('═══════════════════════════════════════');
console.log('  6SIX9INE Email System Test');
console.log('═══════════════════════════════════════\n');

testEmail();
