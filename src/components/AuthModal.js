'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signInWithGoogle } from '@/lib/auth';

export default function AuthModal({ isOpen, onClose }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    console.log('🔐 Login attempt with:', email);
    
    try {
      const user = await signIn(email, password);
      console.log('✅ Login successful, user:', user);
      
      // Check if it's the admin user
      if (user && user.email === 'admin@6six9ine.com') {
        console.log('👑 Admin detected, redirecting to /admin');
        // Redirect to admin page using window.location
        window.location.href = '/admin';
      } else {
        console.log('👤 Regular user, reloading page');
        // Regular user, just reload
        window.location.reload();
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Invalid credentials');
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      await signInWithGoogle();
      onClose();
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close" 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            fontSize: '28px',
            color: 'var(--text)',
            cursor: 'pointer',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--bg-tertiary)';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.transform = 'scale(1)';
          }}
          aria-label="Close"
        >
          &times;
        </button>
        <h2>SIGN IN</h2>
        {error && <p style={{color:'var(--danger)',fontSize:'13px',marginBottom:'16px',textAlign:'center'}}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input className="modal-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="modal-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="modal-btn" type="submit" disabled={loading}>
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
      </div>
    </div>
  );
}
