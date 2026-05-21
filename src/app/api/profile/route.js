import { NextResponse } from 'next/server';
import { getDocument, setDocument } from '@/lib/firebaseAdmin';

// Default profile data
const DEFAULT_PROFILE = {
  gcashName: '6SIX9INE CLOTHING',
  gcashNumber: '0912 345 6789',
  gcashQR: '',
  payMayaName: '6SIX9INE CLOTHING',
  payMayaNumber: '0912 345 6789',
  bankName: 'BDO',
  bankAccountName: '6SIX9INE CLOTHING',
  bankAccountNumber: '1234567890',
  email: 'admin@6six9ine.com',
};

// GET profile
export async function GET() {
  try {
    console.log('📥 [API] GET /api/profile');
    
    const profile = await getDocument('settings', 'profile');
    
    if (!profile) {
      console.log('📦 [API] No profile found, returning default');
      return NextResponse.json(DEFAULT_PROFILE);
    }
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error('❌ [API] Error fetching profile:', error);
    return NextResponse.json(DEFAULT_PROFILE);
  }
}

// POST update profile
export async function POST(request) {
  try {
    console.log('📤 [API] POST /api/profile');
    
    const profileData = await request.json();
    
    await setDocument('settings', 'profile', {
      ...profileData,
      updatedAt: new Date().toISOString()
    });
    
    console.log('✅ [API] POST /api/profile - Profile saved');
    
    return NextResponse.json({ success: true, profile: profileData });
  } catch (error) {
    console.error('❌ [API] Error saving profile:', error);
    return NextResponse.json({ error: 'Failed to save profile', details: error.message }, { status: 500 });
  }
}
