'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductContext';
import AlertModal from '@/components/AlertModal';

export default function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCart();
  const { getProduct } = useProducts();
  const [alertModal, setAlertModal] = useState(null);

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  const handleQuantityChange = (item, newQuantity) => {
    // Get current product stock
    const product = getProduct(item.id);
    const maxStock = product?.quantity || 0;
    
    if (newQuantity > maxStock) {
      setAlertModal({ 
        message: `Only ${maxStock} items available in stock`, 
        type: 'warning' 
      });
      updateQuantity(item.id, item.size, maxStock, maxStock);
      return;
    }
    
    const result = updateQuantity(item.id, item.size, newQuantity, maxStock);
    if (!result.success && result.adjustedQuantity) {
      setAlertModal({ 
        message: result.message, 
        type: 'warning' 
      });
    }
  };

  return (
    <>
      {alertModal && (
        <AlertModal 
          message={alertModal.message}
          type={alertModal.type}
          onClose={() => setAlertModal(null)}
        />
      )}
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={closeCart} />
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>YOUR CART ({items.length})</h3>
          <button className="cart-close" onClick={closeCart}>&times;</button>
        </div>
        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
            </div>
          ) : (
            items.map((item, i) => {
              const product = getProduct(item.id);
              const maxStock = product?.quantity || 0;
              const isLowStock = maxStock > 0 && maxStock <= 5;
              const isOutOfStock = maxStock === 0;
              
              return (
                <div className="cart-item" key={`${item.id}-${item.size}-${i}`}>
                  <div className="cart-item-img">
                    {item.images?.[0] && <img src={item.images[0]} alt={item.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />}
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-size">Size: {item.size}</div>
                    
                    {/* Stock Warning */}
                    {isOutOfStock && (
                      <div style={{
                        fontSize: '11px',
                        color: 'var(--danger)',
                        marginTop: '4px',
                        fontWeight: '600'
                      }}>
                        ⚠️ Out of stock
                      </div>
                    )}
                    {isLowStock && !isOutOfStock && (
                      <div style={{
                        fontSize: '11px',
                        color: 'var(--accent)',
                        marginTop: '4px',
                        fontWeight: '600'
                      }}>
                        Only {maxStock} left in stock
                      </div>
                    )}
                    
                    <div className="cart-item-bottom">
                      <div className="cart-item-qty">
                        <button 
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          disabled={isOutOfStock || item.quantity >= maxStock}
                        >
                          +
                        </button>
                      </div>
                      <div className="cart-item-price">₱{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                    <button className="cart-item-remove" onClick={() => removeItem(item.id, item.size)}>Remove</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Subtotal</span>
              <span>₱{subtotal.toLocaleString()}</span>
            </div>
            <button className="cart-checkout" onClick={handleCheckout}>CHECKOUT</button>
          </div>
        )}
      </div>
    </>
  );
}
