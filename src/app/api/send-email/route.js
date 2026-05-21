import { NextResponse } from 'next/server';
import {
  sendAdminOrderNotification,
  sendCustomerOrderConfirmation,
  sendPaymentApprovedEmail,
  sendPaymentRejectedEmail,
} from '@/lib/email';

export async function POST(request) {
  try {
    const { type, order } = await request.json();

    console.log(`📧 [Email API] Received request to send ${type} email`);
    console.log(`📧 [Email API] Order ID:`, order.orderId);
    console.log(`📧 [Email API] Customer email:`, order.email);
    console.log(`📧 [Email API] Customer name:`, order.customerName);

    if (!order.email) {
      console.error('❌ [Email API] No email address provided in order');
      return NextResponse.json(
        { error: 'No email address provided' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'admin-notification':
        console.log('📧 [Email API] Sending admin notification...');
        result = await sendAdminOrderNotification(order);
        break;

      case 'customer-confirmation':
        console.log('📧 [Email API] Sending customer confirmation...');
        result = await sendCustomerOrderConfirmation(order);
        break;

      case 'payment-approved':
        console.log('📧 [Email API] Sending payment approved email...');
        result = await sendPaymentApprovedEmail(order);
        break;

      case 'payment-rejected':
        console.log('📧 [Email API] Sending payment rejected email...');
        result = await sendPaymentRejectedEmail(order);
        break;

      default:
        console.error('❌ [Email API] Invalid email type:', type);
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    if (result.success) {
      console.log(`✅ [Email API] ${type} email sent successfully to ${order.email}`);
      console.log(`✅ [Email API] Result:`, result.data);
      return NextResponse.json({ success: true, data: result.data });
    } else {
      console.error(`❌ [Email API] Failed to send ${type} email:`, result.error);
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ [Email API] Exception:', error);
    console.error('❌ [Email API] Error message:', error.message);
    console.error('❌ [Email API] Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
}
