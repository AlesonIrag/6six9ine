import { NextResponse } from 'next/server';
import { getDocument, setDocument } from '@/lib/firebaseAdmin';

// Default story content
const DEFAULT_STORY = {
  title: 'OUR STORY',
  subtitle: 'Against All Odds — Since Day One',
  sections: [
    {
      title: 'THE BEGINNING',
      content: '6six9ine was born from the streets — a raw, unfiltered response to a world that tried to keep us down. We started with nothing but a vision: to create streetwear that speaks for those who refuse to be silenced. Every stitch, every graphic, every piece carries the weight of our journey.',
      image: ''
    },
    {
      title: 'THE MISSION',
      content: 'We don\'t follow trends — we set them. Our mission is to empower the bold, the dreamers, and the rebels. Against All Odds isn\'t just our tagline — it\'s our DNA. Every collection is designed to make you feel invincible, unstoppable, and unapologetically yourself.',
      image: ''
    },
    {
      title: 'THE CRAFT',
      content: 'Premium materials. Heavyweight cotton. Hand-finished details. We obsess over quality because you deserve more than fast fashion throwaways. Every piece is built to last — just like the people who wear them.',
      image: ''
    }
  ]
};

// GET story content
export async function GET() {
  try {
    console.log('📥 [API] GET /api/story - Fetching story from Firebase...');
    
    const story = await getDocument('settings', 'story');
    
    if (!story) {
      console.log('📦 [API] No story found in Firebase, returning default');
      return NextResponse.json(DEFAULT_STORY);
    }
    
    console.log(`✅ [API] GET /api/story - Returned story with ${story.sections?.length || 0} sections`);
    return NextResponse.json(story);
  } catch (error) {
    console.error('❌ [API] Error fetching story:', error);
    return NextResponse.json(DEFAULT_STORY);
  }
}

// POST save story content
export async function POST(request) {
  try {
    console.log('📤 [API] POST /api/story - Starting save operation...');
    
    const storyData = await request.json();
    console.log(`📦 [API] Received story with ${storyData.sections?.length || 0} sections`);
    
    const dataToSave = {
      ...storyData,
      updatedAt: new Date().toISOString()
    };
    
    console.log('🔥 [API] Calling Firestore REST API...');
    
    await setDocument('settings', 'story', dataToSave);
    
    console.log(`✅ [API] POST /api/story - Successfully saved story to Firebase`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ [API] Error saving story:', error);
    return NextResponse.json({ 
      error: 'Failed to save story', 
      details: error.message
    }, { status: 500 });
  }
}
