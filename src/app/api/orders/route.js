import { NextResponse } from 'next/server';
import { listDocuments, addDocument } from '@/lib/firebaseAdmin';

// GET all orders
export async function GET() {
  try {
    console.log('📥 [API] GET /api/orders - Fetching orders from Firebase...');
    
    const orders = await listDocuments('orders');
    
    console.log(`✅ [API] GET /api/orders - Returned ${orders.length} orders`);
    return NextResponse.json(orders);
  } catch (error) {
    console.error('❌ [API] Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders', details: error.message }, { status: 500 });
  }
}

// POST new order
export async function POST(request) {
  try {
    console.log('📤 [API] POST /api/orders - Creating new order...');
    
    const orderData = await request.json();
    console.log('📦 [API] Order data received:', {
      orderId: orderData.orderId,
      customerName: orderData.customerName,
      email: orderData.email,
      itemsCount: orderData.items?.length,
      total: orderData.total,
      proofOfPaymentSize: orderData.proofOfPayment?.length || 0
    });
    
    // Validate required fields
    if (!orderData.orderId || !orderData.customerName || !orderData.email) {
      console.error('❌ [API] Missing required fields');
      return NextResponse.json({ 
        error: 'Missing required fields', 
        details: 'orderId, customerName, and email are required' 
      }, { status: 400 });
    }
    
    // Add timestamps
    const newOrder = {
      ...orderData,
      createdAt: orderData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('💾 [API] Saving order to Firebase...');
    const docId = await addDocument('orders', newOrder);
    
    console.log(`✅ [API] POST /api/orders - Order created with ID: ${docId}`);
    
    return NextResponse.json({ 
      success: true, 
      orderId: docId,
      order: { id: docId, ...newOrder } 
    }, { status: 201 });
  } catch (error) {
    console.error('❌ [API] Error creating order:', error);
    console.error('❌ [API] Error stack:', error.stack);
    return NextResponse.json({ 
      error: 'Failed to create order', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
