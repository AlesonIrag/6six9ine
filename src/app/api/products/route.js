import { NextResponse } from 'next/server';
import { getDocument, setDocument } from '@/lib/firebaseAdmin';

// GET all products
export async function GET() {
  try {
    console.log('📥 [API] GET /api/products - Fetching products from Firebase...');
    
    const data = await getDocument('settings', 'products');
    
    if (!data || !data.items) {
      console.log('📦 [API] No products found in Firebase, returning empty array');
      return NextResponse.json([]);
    }
    
    const products = data.items;
    console.log(`✅ [API] GET /api/products - Returned ${products.length} products`);
    return NextResponse.json(products);
  } catch (error) {
    console.error('❌ [API] Error fetching products:', error);
    console.error('❌ [API] Error details:', {
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json({ error: 'Failed to fetch products', details: error.message }, { status: 500 });
  }
}

// POST save all products
export async function POST(request) {
  try {
    console.log('📤 [API] POST /api/products - Starting save operation...');
    
    const products = await request.json();
    console.log(`📦 [API] Received ${products.length} products to save`);
    console.log('📋 [API] First product:', products[0]?.name || 'N/A');
    
    const dataToSave = { 
      items: products,
      updatedAt: new Date().toISOString()
    };
    
    console.log('🔥 [API] Calling Firestore REST API...');
    
    await setDocument('settings', 'products', dataToSave);
    
    console.log(`✅ [API] POST /api/products - Successfully saved ${products.length} products to Firebase`);
    console.log('🎉 [API] Data should now be visible in Firebase Console');
    
    return NextResponse.json({ success: true, count: products.length });
  } catch (error) {
    console.error('❌ [API] Error saving products:', error);
    console.error('❌ [API] Error details:', {
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json({ 
      error: 'Failed to save products', 
      details: error.message
    }, { status: 500 });
  }
}
