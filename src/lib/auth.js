import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from './firebase';

// Email/Password Auth
export async function signUp(email, password) {
  if (!auth) throw new Error('Auth not initialized');
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

// Temporary Admin Credentials (for development only)
const TEMP_ADMIN = {
  email: 'admin@6six9ine.com',
  password: 'admin123',
  uid: 'temp-admin-001',
  displayName: 'Admin User'
};

export async function signIn(email, password) {
  // Check for temporary admin credentials first
  if (email === TEMP_ADMIN.email && password === TEMP_ADMIN.password) {
    // Create a mock user object
    const mockUser = {
      uid: TEMP_ADMIN.uid,
      email: TEMP_ADMIN.email,
      displayName: TEMP_ADMIN.displayName,
      emailVerified: true
    };
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('tempAdminUser', JSON.stringify(mockUser));
    }
    
    return mockUser;
  }

  // Otherwise use Firebase auth
  if (!auth) throw new Error('Auth not initialized');
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function logOut() {
  // Clear temporary admin user
  if (typeof window !== 'undefined') {
    localStorage.removeItem('tempAdminUser');
  }
  
  if (!auth) throw new Error('Auth not initialized');
  await signOut(auth);
}

// Google Auth
const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  if (!auth) throw new Error('Auth not initialized');
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

// Passwordless Email Link Auth
export async function sendEmailLink(email) {
  if (!auth) throw new Error('Auth not initialized');
  const actionCodeSettings = {
    url: typeof window !== 'undefined' ? `${window.location.origin}/account` : 'http://localhost:3000/account',
    handleCodeInApp: true,
  };
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('emailForSignIn', email);
  }
}

export async function completeEmailLinkSignIn() {
  if (typeof window === 'undefined' || !auth) return null;

  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      email = window.prompt('Please provide your email for confirmation');
    }
    const result = await signInWithEmailLink(auth, email, window.location.href);
    window.localStorage.removeItem('emailForSignIn');
    return result.user;
  }
  return null;
}

// Auth State Observer
export function onAuthChange(callback) {
  // Check for temporary admin user on mount
  if (typeof window !== 'undefined') {
    const tempUser = localStorage.getItem('tempAdminUser');
    if (tempUser) {
      try {
        callback(JSON.parse(tempUser));
      } catch (e) {
        console.error('Error parsing temp admin user:', e);
      }
    }
  }

  if (!auth) {
    console.warn('Auth not initialized, skipping auth state observer');
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export { auth };
