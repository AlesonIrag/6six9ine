'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function Navbar({ onAuthClick }) {
  const { toggleCart, itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/">
            <img src="/images/logo.png" alt="6six9ine" className="nav-logo" />
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links">
            <Link href="/">HOME</Link>
            <Link href="/shop">ONLINE STORE</Link>
            <Link href="/story">OUR STORY</Link>
            <Link href="/blog">BLOG</Link>
          </div>

          <div className="nav-actions">
            <button onClick={onAuthClick} aria-label="Account">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
            <button onClick={toggleCart} aria-label="Cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </button>
            <button 
              className="mobile-toggle" 
              onClick={() => setMobileOpen(!mobileOpen)} 
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu-drawer ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <img src="/images/logo.png" alt="6six9ine" className="mobile-menu-logo" />
          <button 
            className="mobile-menu-close" 
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <nav className="mobile-menu-nav">
          <Link href="/" onClick={handleLinkClick} className={pathname === '/' ? 'active' : ''}>
            HOME
          </Link>
          <Link href="/shop" onClick={handleLinkClick} className={pathname === '/shop' ? 'active' : ''}>
            ONLINE STORE
          </Link>
          <Link href="/story" onClick={handleLinkClick} className={pathname === '/story' ? 'active' : ''}>
            OUR STORY
          </Link>
          <Link href="/blog" onClick={handleLinkClick} className={pathname === '/blog' ? 'active' : ''}>
            BLOG
          </Link>
        </nav>

        <div className="mobile-menu-footer">
          <button 
            onClick={() => {
              setMobileOpen(false);
              toggleCart();
            }}
            className="mobile-menu-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            VIEW CART {itemCount > 0 && `(${itemCount})`}
          </button>
        </div>
      </div>
    </>
  );
}
