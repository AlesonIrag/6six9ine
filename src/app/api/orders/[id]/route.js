import { NextResponse } from 'next/server';
import { getDocument, setDocument } from '@/lib/firebaseAdmin';

// GET specific order
export async function GET(request, { params }) {
  try {
    const { id } = params;
    console.log(`📥 [API] GET /api/orders/${id}`);
    
    const order = await getDocument('orders', id);
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json({ id, ...order });
  } catch (error) {
    console.error('❌ [API] Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order', details: error.message }, { status: 500 });
  }
}

// PATCH update order
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const updates = await request.json();
    
    console.log(`📤 [API] PATCH /api/orders/${id}`);
    console.log(`📋 [API] Updates:`, updates);
    console.log(`📋 [API] Params:`, params);
    
    if (!id) {
      console.error('❌ [API] No order ID provided');
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }
    
    // Get existing order first
    console.log(`🔍 [API] Fetching existing order...`);
    const existingOrder = await getDocument('orders', id);
    
    if (!existingOrder) {
      console.error(`❌ [API] Order not found: ${id}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    console.log(`✅ [API] Existing order found`);
    
    // Merge updates with existing data
    const updatedOrder = {
      ...existingOrder,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    console.log(`💾 [API] Saving updated order...`);
    await setDocument('orders', id, updatedOrder);
    
    console.log(`✅ [API] PATCH /api/orders/${id} - Order updated successfully`);
    
    return NextResponse.json({ id, ...updatedOrder });
  } catch (error) {
    console.error('❌ [API] Error updating order:', error);
    console.error('❌ [API] Error stack:', error.stack);
    return NextResponse.json({ error: 'Failed to update order', details: error.message }, { status: 500 });
  }
}

// DELETE order
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    console.log(`🗑️ [API] DELETE /api/orders/${id}`);
    
    // Note: Firestore REST API doesn't have a simple delete endpoint
    // We'll need to use the full REST API delete method
    const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "six9ine-ec11e";
    const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/orders/${id}?key=${FIREBASE_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete: ${response.status}`);
    }
    
    console.log(`✅ [API] DELETE /api/orders/${id} - Order deleted`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ [API] Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order', details: error.message }, { status: 500 });
  }
}
