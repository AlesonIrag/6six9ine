'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductContext';
import ProductCard from '@/components/ProductCard';
import AlertModal from '@/components/AlertModal';

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useCart();
  const { getProduct, updateProductStock, products } = useProducts();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [alertModal, setAlertModal] = useState(null);

  useEffect(() => {
    const foundProduct = getProduct(params.slug);
    setProduct(foundProduct);
  }, [params.slug, getProduct]);

  // Real-time product updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      const updatedProduct = getProduct(params.slug);
      if (updatedProduct && JSON.stringify(updatedProduct) !== JSON.stringify(product)) {
        setProduct(updatedProduct);
        console.log('🔄 Product updated in real-time');
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(updateInterval);
  }, [params.slug, getProduct, product]);

  if (!product) {
    return (
      <div className="section" style={{textAlign:'center',minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div>
          <h2 style={{fontFamily:'Bebas Neue',fontSize:'36px',letterSpacing:'2px',marginBottom:'16px'}}>PRODUCT NOT FOUND</h2>
          <Link href="/shop" className="hero-cta" style={{display:'inline-flex'}}>BACK TO SHOP</Link>
        </div>
      </div>
    );
  }

  const related = products
    .filter(p => p.category === product.category && p.slug !== product.slug)
    .sort((a, b) => {
      if (a.inStock === b.inStock) return 0;
      return a.inStock ? -1 : 1;
    })
    .slice(0, 4);

  const availableStock = product.quantity || 0;
  const maxQuantity = Math.min(availableStock, 10); // Limit to 10 per order

  const handleAddToCart = () => {
    if (!selectedSize) { 
      setAlertModal({ message: 'Please select a size', type: 'warning' });
      return; 
    }
    
    if (availableStock < 1) {
      setAlertModal({ message: 'This product is out of stock', type: 'error' });
      return;
    }

    if (quantity > availableStock) {
      setAlertModal({ message: `Only ${availableStock} items available in stock`, type: 'error' });
      return;
    }

    const colorName = product.colorVariants?.[selectedColor] || 'default';
    const result = addItem({ 
      id: product.slug, 
      name: product.name, 
      price: product.price, 
      images: product.images,
      color: colorName,
      quantity: product.quantity // Pass current stock to cart
    }, selectedSize, quantity);
    
    // Show appropriate message based on result
    if (result.success) {
      if (result.addedQuantity < quantity) {
        setAlertModal({ 
          message: `Only ${result.addedQuantity} items added. Maximum stock (${result.maxStock}) reached.`, 
          type: 'warning' 
        });
      } else {
        setAlertModal({ message: 'Added to cart!', type: 'success' });
      }
      // Deduct stock
      updateProductStock(product.slug, -result.addedQuantity);
    } else {
      setAlertModal({ message: result.message, type: 'error' });
    }
  };

  // Get color name from colorVariants array or fallback to filename detection
  const getColorName = (index) => {
    // First try to get from colorVariants array
    if (product.colorVariants && product.colorVariants[index]) {
      const variant = product.colorVariants[index];
      // Handle both string and object formats
      if (typeof variant === 'string') return variant;
      if (typeof variant === 'object' && variant.color) return variant.color;
    }
    
    // Fallback to filename detection for old products
    const imagePath = getImageUrl(product.images[index]);
    const filename = imagePath.split('/').pop().split('.')[0];
    if (filename.includes('b')) return 'Black';
    if (filename.includes('w')) return 'White';
    if (filename.includes('g')) return 'Gray';
    if (filename.includes('r')) return 'Red';
    return 'Default';
  };

  // Helper function to get image URL (handles both string and object formats)
  const getImageUrl = (img) => {
    if (typeof img === 'string') return img;
    if (typeof img === 'object' && img.image) return img.image;
    return img;
  };

  // Check if product should show color variants (only tops with multiple images)
  const showColorVariants = product.category === 'tops' && product.images.length > 1;

  return (
    <div className="section">
      {alertModal && (
        <AlertModal 
          message={alertModal.message}
          type={alertModal.type}
          onClose={() => setAlertModal(null)}
        />
      )}
      <div className="container">
        <div className="product-detail">
          <div className="product-gallery">
            <div className="product-thumbs">
              {product.images.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`product-thumb ${selectedImage === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                  style={{cursor: 'pointer'}}
                >
                  <img src={getImageUrl(img)} alt={`${product.name} ${idx + 1}`} style={{width:'100%',height:'100%',objectFit:'contain'}} />
                </div>
              ))}
            </div>
            <div className="product-main-img">
              <img 
                src={getImageUrl(product.images[selectedImage])} 
                alt={product.name}
                style={{width:'100%',height:'100%',objectFit:'contain'}}
              />
            </div>
          </div>
          <div className="product-info">
            <div className="product-brand">6SIX9INE</div>
            <h1 className="product-name">{product.name}</h1>
            <div className="product-price">
              {product.comparePrice ? (
                <>
                  <span className="sale">₱{product.price.toLocaleString()}</span>
                  <span className="original">₱{product.comparePrice.toLocaleString()}</span>
                </>
              ) : (
                <span>₱{product.price.toLocaleString()}</span>
              )}
            </div>

            {/* Stock Availability */}
            <div style={{marginTop:'16px',marginBottom:'24px'}}>
              <div style={{
                display:'flex',
                flexDirection:'column',
                gap:'12px',
                padding:'16px',
                background: availableStock > 10 ? 'rgba(46, 204, 113, 0.1)' : availableStock > 0 ? 'rgba(241, 196, 15, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                border: `2px solid ${availableStock > 10 ? 'var(--success)' : availableStock > 0 ? 'var(--accent)' : 'var(--danger)'}`,
                borderRadius:'8px'
              }}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{
                    fontSize:'12px',
                    fontWeight:'700',
                    letterSpacing:'1px',
                    color: availableStock > 10 ? 'var(--success)' : availableStock > 0 ? 'var(--accent)' : 'var(--danger)'
                  }}>
                    {availableStock > 10 ? '✓ IN STOCK' : availableStock > 0 ? `⚠ ONLY ${availableStock} LEFT` : '✗ OUT OF STOCK'}
                  </span>
                  <span style={{
                    fontSize:'14px',
                    fontWeight:'700',
                    color: availableStock > 10 ? 'var(--success)' : availableStock > 0 ? 'var(--accent)' : 'var(--danger)'
                  }}>
                    {availableStock} {availableStock === 1 ? 'item' : 'items'} available
                  </span>
                </div>
                {availableStock > 0 && availableStock <= 10 && (
                  <div style={{
                    fontSize:'11px',
                    color:'var(--text)',
                    padding:'8px 12px',
                    background:'rgba(255,255,255,0.05)',
                    borderRadius:'4px',
                    borderLeft:'3px solid var(--accent)'
                  }}>
                    🔥 Hurry! Limited stock remaining. Order now before it's gone!
                  </div>
                )}
              </div>
            </div>

            {/* Color Variants - Only for tops */}
            {showColorVariants && (
              <>
                <div className="size-label" style={{marginTop:'24px'}}>
                  <span>Color: {getColorName(selectedColor)}</span>
                </div>
                <div className="size-options" style={{marginBottom:'24px'}}>
                  {product.images.map((img, idx) => (
                    <button 
                      key={idx}
                      className={`size-btn ${selectedColor === idx ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedColor(idx);
                        setSelectedImage(idx);
                      }}
                      style={{
                        width: '56px',
                        height: '56px',
                        padding: '4px',
                        overflow: 'hidden'
                      }}
                      title={getColorName(idx)}
                    >
                      <img 
                        src={img} 
                        alt={getColorName(idx)}
                        style={{width:'100%',height:'100%',objectFit:'contain'}}
                      />
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="size-label">
              <span>Size:</span>
              <a href="#">Size chart</a>
            </div>
            <div className="size-options">
              {product.sizes.map(size => {
                const isUnavailable = product.unavailableSizes && product.unavailableSizes.includes(size);
                return (
                  <button 
                    key={size} 
                    className={`size-btn ${selectedSize === size ? 'active' : ''} ${isUnavailable ? 'unavailable' : ''}`} 
                    onClick={() => !isUnavailable && setSelectedSize(size)}
                    disabled={isUnavailable}
                    title={isUnavailable ? 'Out of stock' : 'Available'}
                  >
                    {size}
                    {isUnavailable && <span style={{fontSize:'10px',display:'block',marginTop:'2px',color:'var(--danger)'}}>✗</span>}
                  </button>
                );
              })}
            </div>
            {product.unavailableSizes && product.unavailableSizes.length > 0 && (
              <div style={{
                fontSize:'11px',
                color:'var(--text-secondary)',
                marginTop:'8px',
                padding:'8px 12px',
                background:'rgba(231, 76, 60, 0.1)',
                border:'1px solid var(--danger)',
                borderRadius:'4px'
              }}>
                ⚠ Out of stock sizes: {product.unavailableSizes.join(', ')}
              </div>
            )}
            <div className="qty-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))} disabled={quantity >= maxQuantity}>+</button>
            </div>
            <button className="add-to-cart" onClick={handleAddToCart} disabled={!product.inStock || availableStock === 0}>
              {availableStock > 0 ? 'ADD TO CART' : 'SOLD OUT'}
            </button>
            <p className="product-desc">{product.description}</p>
            {product.details && (
              <ul className="product-details-list">
                {product.details.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div style={{marginTop:'64px'}}>
            <div className="section-header">
              <h2>YOU MIGHT ALSO LIKE</h2>
            </div>
            <div className="products-grid">
              {related.map(p => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
