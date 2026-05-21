// Email Service using Resend
// This handles all email notifications for the system

import { Resend } from 'resend';

// Initialize Resend with API key
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@6six9ine.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';

console.log('📧 [Email Service] Initializing...');
console.log('📧 [Email Service] API Key exists:', !!RESEND_API_KEY);
console.log('📧 [Email Service] API Key length:', RESEND_API_KEY?.length || 0);
console.log('📧 [Email Service] Admin Email:', ADMIN_EMAIL);
console.log('📧 [Email Service] From Email:', FROM_EMAIL);

if (!RESEND_API_KEY) {
  console.error('❌ [Email Service] RESEND_API_KEY is not set in environment variables!');
}

const resend = new Resend(RESEND_API_KEY);

console.log('✅ [Email Service] Resend initialized');

/**
 * Send email notification to admin when new order is placed
 */
export async function sendAdminOrderNotification(order) {
  try {
    console.log('📧 Sending admin notification for order:', order.orderId);
    
    const itemsList = order.items.map(item => 
      `• ${item.name} (Size: ${item.size}, Color: ${item.color}) x${item.quantity} - ₱${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🔔 New Order #${order.orderId} - Action Required`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #D4A843; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .order-box { background: white; padding: 20px; border-left: 4px solid #D4A843; margin: 20px 0; }
            .button { display: inline-block; background: #D4A843; color: #1a1a1a; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .items { background: white; padding: 15px; margin: 15px 0; border-radius: 6px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🔔 NEW ORDER</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Action Required</p>
            </div>
            <div class="content">
              <p style="font-size: 16px; margin-bottom: 20px;">Hi Admin,</p>
              <p>You have a new order that needs payment verification!</p>
              
              <div class="order-box">
                <h2 style="margin-top: 0; color: #D4A843;">ORDER DETAILS</h2>
                <p><strong>Order ID:</strong> ${order.orderId}</p>
                <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
              </div>

              <div class="order-box">
                <h3 style="margin-top: 0;">CUSTOMER INFO</h3>
                <p><strong>Name:</strong> ${order.customerName}</p>
                <p><strong>Email:</strong> ${order.email}</p>
                <p><strong>Phone:</strong> ${order.phone}</p>
                <p><strong>Address:</strong> ${order.address}</p>
              </div>

              <div class="items">
                <h3 style="margin-top: 0;">ORDER ITEMS</h3>
                <pre style="font-family: Arial; white-space: pre-wrap;">${itemsList}</pre>
                <hr style="border: none; border-top: 2px solid #D4A843; margin: 15px 0;">
                <p style="font-size: 18px; font-weight: bold;">TOTAL: ₱${order.total.toLocaleString()}</p>
              </div>

              <div class="warning">
                <p style="margin: 0;"><strong>⚠️ PAYMENT STATUS:</strong> Pending Verification</p>
                <p style="margin: 10px 0 0 0;"><strong>Payment Method:</strong> GCash</p>
              </div>

              <p style="margin-top: 30px;">Please verify the payment screenshot and approve or reject the order.</p>

              <center>
                <a href="http://localhost:3000/admin" class="button">View Order & Proof of Payment</a>
              </center>

              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                <strong>Next Steps:</strong><br>
                1. Check your GCash app for the payment<br>
                2. Login to admin panel<br>
                3. Review the proof of payment screenshot<br>
                4. Approve or reject the order
              </p>
            </div>
            <div class="footer">
              <p>6SIX9INE Clothing - Against All Odds</p>
              <p>This is an automated notification from your e-commerce system.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Failed to send admin email:', error);
      return { success: false, error };
    }

    console.log('✅ Admin notification sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error sending admin email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send order confirmation to customer
 */
export async function sendCustomerOrderConfirmation(order) {
  try {
    console.log('📧 Sending customer confirmation for order:', order.orderId);
    
    const itemsList = order.items.map(item => 
      `• ${item.name} (Size: ${item.size}, Color: ${item.color}) x${item.quantity} - ₱${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.email,
      subject: `✅ Order Received #${order.orderId} - Awaiting Verification`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #D4A843; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .order-box { background: white; padding: 20px; border-left: 4px solid #D4A843; margin: 20px 0; }
            .items { background: white; padding: 15px; margin: 15px 0; border-radius: 6px; }
            .info-box { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">✅ ORDER RECEIVED</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Thank You for Your Order!</p>
            </div>
            <div class="content">
              <p style="font-size: 16px; margin-bottom: 20px;">Hi ${order.customerName},</p>
              <p>Thank you for shopping with 6SIX9INE! We've received your order and payment proof.</p>
              
              <div class="order-box">
                <h2 style="margin-top: 0; color: #D4A843;">ORDER CONFIRMATION</h2>
                <p><strong>Order ID:</strong> ${order.orderId}</p>
                <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                <p style="color: #D4A843; font-weight: bold;">Please save this Order ID for tracking!</p>
              </div>

              <div class="items">
                <h3 style="margin-top: 0;">YOUR ORDER</h3>
                <pre style="font-family: Arial; white-space: pre-wrap;">${itemsList}</pre>
                <hr style="border: none; border-top: 2px solid #D4A843; margin: 15px 0;">
                <p style="font-size: 18px; font-weight: bold;">TOTAL: ₱${order.total.toLocaleString()}</p>
              </div>

              <div class="info-box">
                <p style="margin: 0;"><strong>📋 PAYMENT STATUS:</strong> Awaiting Verification</p>
                <p style="margin: 10px 0 0 0;">We're currently verifying your GCash payment. You'll receive another email once your payment is approved.</p>
              </div>

              <p style="margin-top: 30px;"><strong>What happens next?</strong></p>
              <ol style="padding-left: 20px;">
                <li>Our team will verify your payment (usually within a few hours)</li>
                <li>You'll receive an email confirmation once approved</li>
                <li>We'll prepare your order for shipment</li>
                <li>You'll receive tracking information when shipped</li>
              </ol>

              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                <strong>Questions or concerns?</strong><br>
                Feel free to reply to this email or contact us at:<br>
                📧 Email: ${ADMIN_EMAIL}<br>
                📱 Phone: ${order.phone}
              </p>
            </div>
            <div class="footer">
              <p><strong>6SIX9INE Clothing</strong></p>
              <p>Against All Odds</p>
              <p style="margin-top: 10px;">Thank you for supporting our brand!</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Failed to send customer confirmation:', error);
      return { success: false, error };
    }

    console.log('✅ Customer confirmation sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error sending customer confirmation:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send payment approved notification to customer
 */
export async function sendPaymentApprovedEmail(order) {
  try {
    console.log('📧 Sending payment approved email for order:', order.orderId);
    console.log('📧 To email:', order.email);
    console.log('📧 Customer name:', order.customerName);
    
    if (!order.email) {
      console.error('❌ No email address in order');
      return { success: false, error: 'No email address provided' };
    }
    
    const itemsList = order.items.map(item => 
      `• ${item.name} (Size: ${item.size}, Color: ${item.color}) x${item.quantity} - ₱${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');

    console.log('📧 Calling Resend API...');
    
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.email, // Send to actual customer email
      subject: `🎉 Payment Approved #${order.orderId} - Order Processing`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .order-box { background: white; padding: 20px; border-left: 4px solid #4caf50; margin: 20px 0; }
            .items { background: white; padding: 15px; margin: 15px 0; border-radius: 6px; }
            .success-box { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 32px;">🎉 PAYMENT APPROVED!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Your Order is Being Processed</p>
            </div>
            <div class="content">
              <p style="font-size: 16px; margin-bottom: 20px;">Hi ${order.customerName},</p>
              <p><strong>Great news!</strong> Your payment has been verified and approved!</p>
              
              <div class="success-box">
                <p style="margin: 0; font-size: 18px;"><strong>✅ Payment Verified</strong></p>
                <p style="margin: 10px 0 0 0;">Your order is now being prepared for shipment.</p>
              </div>

              <div class="order-box">
                <h2 style="margin-top: 0; color: #4caf50;">ORDER UPDATE</h2>
                <p><strong>Order ID:</strong> ${order.orderId}</p>
                <p><strong>Status:</strong> <span style="color: #4caf50; font-weight: bold;">Processing</span></p>
              </div>

              <div class="items">
                <h3 style="margin-top: 0;">YOUR ORDER</h3>
                <pre style="font-family: Arial; white-space: pre-wrap;">${itemsList}</pre>
                <hr style="border: none; border-top: 2px solid #4caf50; margin: 15px 0;">
                <p style="font-size: 18px; font-weight: bold;">TOTAL: ₱${order.total.toLocaleString()}</p>
              </div>

              <p style="margin-top: 30px;"><strong>What's next?</strong></p>
              <ol style="padding-left: 20px;">
                <li>We're preparing your items for shipment</li>
                <li>You'll receive tracking information once shipped</li>
                <li>Estimated delivery: 3-5 business days</li>
              </ol>

              <p style="margin-top: 30px; padding: 20px; background: white; border-radius: 8px; text-align: center;">
                <strong style="font-size: 18px; color: #4caf50;">Thank you for your purchase!</strong><br>
                <span style="font-size: 14px; color: #666;">We appreciate your business and trust in 6SIX9INE.</span>
              </p>

              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                <strong>Need help?</strong><br>
                Contact us anytime:<br>
                📧 Email: ${ADMIN_EMAIL}
              </p>
            </div>
            <div class="footer">
              <p><strong>6SIX9INE Clothing</strong></p>
              <p>Against All Odds</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('📧 Resend API response received');
    console.log('📧 Data:', data);
    console.log('📧 Error:', error);

    if (error) {
      console.error('❌ Resend API returned error:', error);
      console.error('❌ Error type:', typeof error);
      console.error('❌ Error keys:', Object.keys(error));
      console.error('❌ Error JSON:', JSON.stringify(error, null, 2));
      return { success: false, error: error };
    }

    console.log('✅ Payment approved email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Exception in sendPaymentApprovedEmail:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    return { success: false, error: error.message };
  }
}

/**
 * Send payment rejected notification to customer
 */
export async function sendPaymentRejectedEmail(order) {
  try {
    console.log('📧 Sending payment rejected email for order:', order.orderId);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.email,
      subject: `⚠️ Payment Issue #${order.orderId} - Action Required`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .order-box { background: white; padding: 20px; border-left: 4px solid #f44336; margin: 20px 0; }
            .warning-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .contact-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">⚠️ PAYMENT ISSUE</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Action Required</p>
            </div>
            <div class="content">
              <p style="font-size: 16px; margin-bottom: 20px;">Hi ${order.customerName},</p>
              <p>We were unable to verify your payment for order #${order.orderId}.</p>
              
              <div class="order-box">
                <h2 style="margin-top: 0; color: #f44336;">ORDER DETAILS</h2>
                <p><strong>Order ID:</strong> ${order.orderId}</p>
                <p><strong>Status:</strong> <span style="color: #f44336; font-weight: bold;">Payment Not Verified</span></p>
                <p><strong>Total:</strong> ₱${order.total.toLocaleString()}</p>
              </div>

              <div class="warning-box">
                <p style="margin: 0;"><strong>Possible Reasons:</strong></p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Payment amount doesn't match order total</li>
                  <li>Payment was sent to wrong GCash number</li>
                  <li>Screenshot is unclear or incomplete</li>
                  <li>Payment not received in our GCash account</li>
                </ul>
              </div>

              <div class="contact-box">
                <h3 style="margin-top: 0; color: #f44336;">WHAT TO DO NEXT</h3>
                <p>Please contact us to resolve this issue:</p>
                <p style="font-size: 18px; margin: 20px 0;">
                  <strong>📧 Email:</strong> ${ADMIN_EMAIL}<br>
                  <strong>📱 Phone:</strong> ${order.phone}
                </p>
                <p style="font-size: 14px; color: #666;">
                  We're here to help! Our team will assist you in resolving this issue quickly.
                </p>
              </div>

              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                <strong>Important:</strong> Your order has been cancelled and stock has been restored. 
                Once we resolve the payment issue, you can place a new order.
              </p>
            </div>
            <div class="footer">
              <p><strong>6SIX9INE Clothing</strong></p>
              <p>Against All Odds</p>
              <p style="margin-top: 10px;">We apologize for any inconvenience.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Failed to send payment rejected email:', error);
      return { success: false, error };
    }

    console.log('✅ Payment rejected email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error sending payment rejected email:', error);
    return { success: false, error: error.message };
  }
}
