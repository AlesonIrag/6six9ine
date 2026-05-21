import { NextResponse } from 'next/server';
import { getDocument, setDocument } from '@/lib/firebaseAdmin';

// GET all blog posts
export async function GET() {
  try {
    console.log('📥 [API] GET /api/blog - Fetching blog posts from Firebase...');
    
    const data = await getDocument('settings', 'blog');
    
    if (!data || !data.posts) {
      console.log('📦 [API] No blog posts found in Firebase, returning empty array');
      return NextResponse.json([]);
    }
    
    const posts = data.posts;
    console.log(`✅ [API] GET /api/blog - Returned ${posts.length} blog posts`);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('❌ [API] Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts', details: error.message }, { status: 500 });
  }
}

// POST save all blog posts
export async function POST(request) {
  try {
    console.log('📤 [API] POST /api/blog - Starting save operation...');
    
    const posts = await request.json();
    console.log(`📦 [API] Received ${posts.length} blog posts to save`);
    
    const dataToSave = { 
      posts: posts,
      updatedAt: new Date().toISOString()
    };
    
    console.log('🔥 [API] Calling Firestore REST API...');
    
    await setDocument('settings', 'blog', dataToSave);
    
    console.log(`✅ [API] POST /api/blog - Successfully saved ${posts.length} blog posts to Firebase`);
    
    return NextResponse.json({ success: true, count: posts.length });
  } catch (error) {
    console.error('❌ [API] Error saving blog posts:', error);
    return NextResponse.json({ 
      error: 'Failed to save blog posts', 
      details: error.message
    }, { status: 500 });
  }
}
