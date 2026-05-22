'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductContext';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import AlertModal from '@/components/AlertModal';

export default function HomePage() {
  const { addItem } = useCart();
  const { products } = useProducts();
  const [email, setEmail] = useState('');
  const [alertModal, setAlertModal] = useState(null);
  
  // Filter and sort featured products - in-stock first
  const featured = products
    .filter(p => p.featured)
    .sort((a, b) => {
      if (a.inStock === b.inStock) return 0;
      return a.inStock ? -1 : 1;
    });
  
  // Filter and sort new drops - in-stock first
  const newDrops = products
    .filter(p => p.isNewDrop)
    .sort((a, b) => {
      if (a.inStock === b.inStock) return 0;
      return a.inStock ? -1 : 1;
    });

  // Log when products update
  console.log('🏠 Homepage - Total products:', products.length);
  console.log('🏠 Homepage - Featured products (all):', featured.length, featured.map(p => p.name));
  console.log('🏠 Homepage - Featured products (displayed):', featured.slice(0, 4).map(p => p.name));
  console.log('🏠 Homepage - New drops (all):', newDrops.length, newDrops.map(p => p.name));
  console.log('🏠 Homepage - New drops (displayed):', newDrops.slice(0, 4).map(p => p.name));

  return (
    <>
      {alertModal && (
        <AlertModal 
          message={alertModal.message}
          type={alertModal.type}
          onClose={() => setAlertModal(null)}
        />
      )}

      {/* HERO */}
      <section className="hero">
        <div className="hero-media-grid">
          <div className="hero-side-video">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="hero-side-video-element"
            >
              <source src="/videos/ii.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="hero-video-container">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="hero-video"
            >
              <source src="/videos/ss.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="hero-side-video">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="hero-side-video-element"
            >
              <source src="/videos/ww.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        <div className="hero-bg" />
        <div className="hero-content">
          <img src="/images/logo.png" alt="6six9ine" className="hero-logo" />
          <h1><span className="accent">6</span>SIX<span className="accent">9</span>INE</h1>
          <p>Against All Odds</p>
          <Link href="/shop" className="hero-cta">SHOP NOW →</Link>
        </div>
      </section>

      {/* FEATURED */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>FEATURED COLLECTION</h2>
            <p>Hand-picked for the bold</p>
          </div>
          <div className="products-grid">
            {featured.slice(0, 4).map(product => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section" style={{background:'var(--bg-secondary)'}}>
        <div className="container">
          <div className="section-header">
            <h2>SHOP BY CATEGORY</h2>
            <p>Find your fit</p>
          </div>
          <div className="categories-grid">
            <CategoryCard 
              name="Tops" 
              href="/shop?category=tops"
              images={['/images/1b.jpg', '/images/1g.jpg', '/images/1w.jpg']}
            />
            <CategoryCard 
              name="Longsleeve" 
              href="/shop?category=longsleeve"
              images={['/images/long2.jpg']}
            />
            <CategoryCard 
              name="Mask" 
              href="/shop?category=mask"
              images={['/images/mask2.jpg']}
            />
            <CategoryCard 
              name="New Drops" 
              href="/shop?category=new-drops"
              images={['/images/11w.jpg', '/images/11r.jpg']}
            />
          </div>
        </div>
      </section>

      {/* NEW DROPS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>NEW DROPS</h2>
            <p>Latest additions to the collection</p>
          </div>
          <div className="products-grid">
            {newDrops.slice(0, 4).map(product => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter">
        <h2>JOIN THE MOVEMENT</h2>
        <p>Get exclusive drops, early access, and brand updates.</p>
        <form className="newsletter-form" onSubmit={(e) => { 
          e.preventDefault(); 
          setEmail(''); 
          setAlertModal({ message: 'Successfully subscribed to newsletter!', type: 'success' });
        }}>
          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button type="submit">SUBSCRIBE</button>
        </form>
      </section>
    </>
  );
}
