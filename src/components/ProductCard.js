'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!product.images || product.images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [product.images]);

  // Helper function to get image URL (handles both string and object formats)
  const getImageUrl = (img) => {
    if (typeof img === 'string') return img;
    if (typeof img === 'object' && img.image) return img.image;
    return img;
  };

  return (
    <Link href={`/shop/${product.slug}`} className="product-card">
      {product.isNewDrop && <span className="product-card-badge">NEW</span>}
      {/* Stock Badge */}
      {(product.quantity || 0) === 0 && (
        <span className="product-card-stock-badge out-of-stock">OUT OF STOCK</span>
      )}
      {(product.quantity || 0) > 0 && (product.quantity || 0) <= 5 && (
        <span className="product-card-stock-badge low-stock">ONLY {product.quantity} LEFT</span>
      )}
      <div className="product-card-img">
        <div className="product-card-slideshow">
          {product.images && product.images.map((img, idx) => (
            <img
              key={idx}
              src={getImageUrl(img)}
              alt={product.name}
              className={`product-slideshow-image ${idx === currentIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
      <div className="product-card-info">
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-price">
          {product.comparePrice ? (
            <>
              <span className="sale">₱{product.price.toLocaleString()}</span>
              <span className="original">₱{product.comparePrice.toLocaleString()}</span>
            </>
          ) : (
            <span>₱{product.price.toLocaleString()}</span>
          )}
        </div>
        {/* Stock indicator */}
        <div style={{
          fontSize:'11px',
          fontWeight:'600',
          marginTop:'4px',
          color: (product.quantity || 0) === 0 ? 'var(--danger)' : (product.quantity || 0) <= 5 ? 'var(--accent)' : 'var(--success)'
        }}>
          {(product.quantity || 0) === 0 ? '✗ Out of Stock' : 
           (product.quantity || 0) <= 5 ? `⚠ ${product.quantity} left` : 
           `✓ ${product.quantity} in stock`}
        </div>
      </div>
    </Link>
  );
}
