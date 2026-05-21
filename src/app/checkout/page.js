'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductContext';
import AlertModal from '@/components/AlertModal';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { getProduct, updateProductStock } = useProducts();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [alertModal, setAlertModal] = useState(null);
  const [proofOfPayment, setProofOfPayment] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);

  // Load payment info from API
  useEffect(() => {
    const loadPaymentInfo = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          setPaymentInfo(data);
        }
      } catch (error) {
        console.error('Failed to load payment info:', error);
      }
    };
    
    loadPaymentInfo();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProofUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setAlertModal({ 
        message: 'Please upload an image file (JPG, PNG, etc.)', 
        type: 'error' 
      });
      return;
    }

    // Validate file size (max 5MB for upload, will be compressed)
    if (file.size > 5 * 1024 * 1024) {
      setAlertModal({ 
        message: 'Image size must be less than 5MB', 
        type: 'error' 
      });
      return;
    }

    // Compress image VERY aggressively to stay under Firebase 1MB limit
    // Firebase limit is 1048487 bytes, but base64 adds ~33% overhead
    // Target 700KB to be safe (700KB * 1.33 = 931KB < 1MB)
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        // Calculate new dimensions (max 600px width for smaller file)
        let width = img.width;
        let height = img.height;
        const maxWidth = 600;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Start with quality 0.5 (more aggressive)
        let quality = 0.5;
        let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Target 700KB (700000 bytes) to account for base64 overhead
        const targetSize = 700000;
        
        // Iteratively compress until under target size
        while (compressedDataUrl.length > targetSize && quality > 0.1) {
          quality -= 0.05;
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          console.log(`🗜️ Compressing... Quality: ${quality.toFixed(2)}, Size: ${(compressedDataUrl.length / 1024).toFixed(0)}KB`);
        }
        
        // Final check - if still too large, fail
        if (compressedDataUrl.length > targetSize) {
          setAlertModal({ 
            message: 'Image is too large even after maximum compression. Please use a smaller screenshot or crop the image before uploading.', 
            type: 'error' 
          });
          return;
        }
        
        console.log(`✅ Image compressed successfully!`);
        console.log(`   - Final size: ${(compressedDataUrl.length / 1024).toFixed(0)}KB`);
        console.log(`   - Quality: ${quality.toFixed(2)}`);
        console.log(`   - Dimensions: ${width}x${height}px`);
        
        setProofOfPayment(compressedDataUrl);
        setProofPreview(compressedDataUrl);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate proof of payment
    if (!proofOfPayment) {
      setAlertModal({ 
        message: 'Please upload proof of payment before placing your order', 
        type: 'warning' 
      });
      return;
    }
    
    // Validate stock availability for all items
    const stockIssues = [];
    for (const item of items) {
      const product = getProduct(item.id);
      const availableStock = product?.quantity || 0;
      
      if (availableStock === 0) {
        stockIssues.push(`${item.name} is out of stock`);
      } else if (item.quantity > availableStock) {
        stockIssues.push(`${item.name}: Only ${availableStock} available (you have ${item.quantity} in cart)`);
      }
    }
    
    if (stockIssues.length > 0) {
      setAlertModal({ 
        message: `Stock issue: ${stockIssues.join(', ')}. Please update your cart.`, 
        type: 'error' 
      });
      return;
    }
    
    // Process order
    processOrder();
  };

  const processOrder = async () => {
    setIsProcessing(true);

    try {
      const orderId = 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();
      const timestamp = new Date().toISOString();
      
      // Create order object with email
      const order = {
        orderId: orderId,
        customerName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, ${formData.province} ${formData.postalCode}`,
        city: formData.city,
        province: formData.province,
        postalCode: formData.postalCode,
        total: finalTotal,
        status: 'pending_payment',
        paymentStatus: 'pending_verification',
        paymentMethod: 'gcash',
        proofOfPayment: proofOfPayment,
        createdAt: timestamp,
        updatedAt: timestamp,
        items: items.map(item => ({
          name: item.name,
          slug: item.slug,
          size: item.size,
          color: item.color || 'Default',
          quantity: item.quantity,
          price: item.price,
          image: item.images?.[0] || item.image
        }))
      };
      
      console.log('📦 Creating order:', orderId);
      console.log('📋 Order items:', order.items.length);
      
      // Save order to Firebase via API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Server error:', errorData);
        throw new Error(errorData.details || errorData.error || 'Failed to create order');
      }

      const result = await response.json();
      console.log('✅ Order saved to Firebase:', result);
      
      // IMPORTANT: Deduct stock for all items after successful order creation
      console.log('📉 Deducting stock for ordered items...');
      for (const item of items) {
        updateProductStock(item.slug, -item.quantity);
        console.log(`  - ${item.name}: -${item.quantity} (${item.slug})`);
      }
      console.log('✅ Stock deducted successfully');
      
      // Send emails to admin and customer
      console.log('📧 Sending email notifications...');
      try {
        // Send admin notification
        const adminEmailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'admin-notification',
            order: order
          })
        });
        
        if (adminEmailResponse.ok) {
          console.log('✅ Admin notification email sent');
        } else {
          console.warn('⚠️ Failed to send admin notification email');
        }

        // Send customer confirmation
        const customerEmailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'customer-confirmation',
            order: order
          })
        });
        
        if (customerEmailResponse.ok) {
          console.log('✅ Customer confirmation email sent');
        } else {
          console.warn('⚠️ Failed to send customer confirmation email');
        }
      } catch (emailError) {
        console.error('⚠️ Email sending failed (non-critical):', emailError);
        // Don't fail the order if emails fail
      }
      
      // Clear cart only after successful order creation
      clearCart();
      console.log('🛒 Cart cleared');
      
      // Show success message with order ID
      setAlertModal({ 
        message: `✅ Order Placed Successfully!\n\nOrder ID: ${orderId}\n\nYour payment is being verified by our admin. You'll be notified via email once approved.\n\nPlease save your Order ID for reference.`, 
        type: 'success' 
      });
      
      // Redirect to home after delay
      setTimeout(() => {
        router.push('/');
      }, 5000);
    } catch (error) {
      console.error('❌ Error creating order:', error);
      setAlertModal({ 
        message: `Failed to place order: ${error.message}. Please try again.`, 
        type: 'error' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="section" style={{textAlign:'center',minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div>
          <h2 style={{fontFamily:'Bebas Neue',fontSize:'36px',letterSpacing:'2px',marginBottom:'16px'}}>YOUR CART IS EMPTY</h2>
          <button onClick={() => router.push('/shop')} className="hero-cta" style={{display:'inline-flex'}}>
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    );
  }

  const finalTotal = subtotal;

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
        <div className="section-header" style={{marginBottom:'40px'}}>
          <h2>CHECKOUT</h2>
          <p>Complete your order</p>
        </div>

        <div className="checkout-layout">
          {/* Left: Checkout Form */}
          <div className="checkout-form-container">
            <form onSubmit={handleSubmit} className="checkout-form">
              {/* Contact Information */}
              <div className="checkout-section">
                <h3 className="checkout-section-title">CONTACT INFORMATION</h3>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+63 912 345 6789"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="checkout-section">
                <h3 className="checkout-section-title">SHIPPING ADDRESS</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Street address, P.O. box"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="checkout-section">
                <h3 className="checkout-section-title">PAYMENT METHOD</h3>
                <div className="payment-options">
                  <div className="payment-option" style={{
                    border: '2px solid #007DFE',
                    background: 'linear-gradient(135deg, rgba(0, 125, 254, 0.1) 0%, rgba(0, 125, 254, 0.05) 100%)',
                    cursor: 'default'
                  }}>
                    <div className="payment-option-content">
                      <span className="payment-option-title" style={{color: '#007DFE'}}>💙 GCash Payment</span>
                      <span className="payment-option-desc">Pay via GCash and upload proof of payment</span>
                    </div>
                  </div>
                </div>

                {/* GCash Payment Details */}
                {paymentInfo && (
                  <div style={{marginTop: '20px'}}>
                    <div style={{
                      display:'flex',
                      alignItems:'center',
                      gap:'8px',
                      marginBottom:'16px',
                      paddingBottom:'12px',
                      borderBottom:'1px solid var(--border)'
                    }}>
                      <span style={{fontSize:'20px'}}>💙</span>
                      <span style={{color:'#007DFE',fontSize:'14px',fontWeight:'700',letterSpacing:'0.5px'}}>GCASH PAYMENT</span>
                    </div>
                    
                    {/* GCash QR Code */}
                    {paymentInfo.gcashQR && (
                      <div style={{
                        padding:'16px',
                        background:'var(--bg-card)',
                        borderRadius:'8px',
                        marginBottom:'16px',
                        textAlign:'center',
                        border:'1px solid var(--border)'
                      }}>
                        <div style={{marginBottom:'8px',fontSize:'12px',fontWeight:'600',color:'#007DFE',textTransform:'uppercase',letterSpacing:'0.5px'}}>
                          Scan to Pay
                        </div>
                        <img 
                          src={paymentInfo.gcashQR} 
                          alt="GCash QR Code"
                          style={{
                            width:'180px',
                            height:'180px',
                            objectFit:'contain',
                            border:'1px solid #007DFE',
                            borderRadius:'6px',
                            padding:'6px',
                            background:'white'
                          }}
                        />
                        <div style={{marginTop:'8px',fontSize:'11px',color:'var(--text-secondary)'}}>
                          Open GCash app and scan
                        </div>
                      </div>
                    )}
                    
                    <div style={{
                      display:'flex',
                      flexDirection:'column',
                      gap:'10px',
                      padding:'14px',
                      background:'var(--bg-card)',
                      borderRadius:'8px',
                      marginBottom:'16px',
                      border:'1px solid var(--border)'
                    }}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <span style={{fontSize:'12px',color:'var(--text-secondary)'}}>Account Name</span>
                        <span style={{fontSize:'13px',fontWeight:'600'}}>{paymentInfo.gcashName || '6SIX9INE CLOTHING'}</span>
                      </div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <span style={{fontSize:'12px',color:'var(--text-secondary)'}}>GCash Number</span>
                        <span style={{fontSize:'15px',fontWeight:'700',color:'#007DFE'}}>{paymentInfo.gcashNumber || '0912 345 6789'}</span>
                      </div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:'8px',borderTop:'1px solid var(--border)'}}>
                        <span style={{fontSize:'12px',color:'var(--text-secondary)'}}>Amount to Pay</span>
                        <span style={{fontSize:'18px',fontWeight:'700',color:'#007DFE'}}>₱{finalTotal.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div style={{
                      padding: '12px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      marginBottom: '12px'
                    }}>
                      <div style={{fontSize:'12px',fontWeight:'600',marginBottom:'8px',color:'var(--text)'}}>
                        📱 How to Pay:
                      </div>
                      <ol style={{margin:0,paddingLeft:'18px',fontSize:'12px',lineHeight:'1.6',color:'var(--text-secondary)'}}>
                        <li>Scan QR code or send to {paymentInfo.gcashNumber}</li>
                        <li>Take screenshot of confirmation</li>
                        <li>Upload screenshot below</li>
                      </ol>
                    </div>
                    
                    <p style={{margin:'0',color:'var(--accent)',fontWeight:'500',textAlign:'center',fontSize:'11px'}}>
                      ⚠️ Order processed after payment verification
                    </p>
                  </div>
                )}

                {/* Proof of Payment Upload */}
                <div className="checkout-section" style={{marginTop:'24px'}}>
                  <h3 className="checkout-section-title">
                    📸 PROOF OF PAYMENT * (Required)
                  </h3>
                  <div style={{
                    padding:'24px',
                    background:'var(--bg-card)',
                    border:'2px dashed var(--border)',
                    borderRadius:'12px',
                    textAlign:'center'
                  }}>
                    {!proofPreview ? (
                      <>
                        <div style={{fontSize:'48px',marginBottom:'16px'}}>📷</div>
                        <label style={{
                          display:'inline-block',
                          padding:'12px 24px',
                          background:'var(--accent)',
                          color:'var(--bg)',
                          borderRadius:'8px',
                          cursor:'pointer',
                          fontWeight:'700',
                          fontSize:'14px',
                          letterSpacing:'1px',
                          transition:'all var(--transition)'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                          <input 
                            type="file"
                            accept="image/*"
                            onChange={handleProofUpload}
                            style={{display:'none'}}
                          />
                          UPLOAD SCREENSHOT
                        </label>
                        <p style={{fontSize:'12px',color:'var(--text-secondary)',marginTop:'12px'}}>
                          Upload a screenshot of your GCash payment confirmation<br/>
                          (JPG, PNG - Max 5MB)
                        </p>
                      </>
                    ) : (
                      <>
                        <div style={{marginBottom:'16px'}}>
                          <img 
                            src={proofPreview} 
                            alt="Proof of Payment"
                            style={{
                              maxWidth:'100%',
                              maxHeight:'300px',
                              borderRadius:'8px',
                              border:'2px solid var(--success)'
                            }}
                          />
                        </div>
                        <div style={{
                          display:'flex',
                          gap:'12px',
                          justifyContent:'center',
                          alignItems:'center'
                        }}>
                          <span style={{
                            fontSize:'14px',
                            color:'var(--success)',
                            fontWeight:'600'
                          }}>
                            ✓ Screenshot uploaded
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setProofOfPayment(null);
                              setProofPreview(null);
                            }}
                            style={{
                              padding:'8px 16px',
                              background:'var(--danger)',
                              color:'white',
                              border:'none',
                              borderRadius:'6px',
                              cursor:'pointer',
                              fontSize:'12px',
                              fontWeight:'600'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  <p style={{
                    fontSize:'11px',
                    color:'var(--text)',
                    marginTop:'12px',
                    padding:'12px',
                    background:'rgba(212, 168, 67, 0.1)',
                    border:'1px solid var(--accent)',
                    borderRadius:'6px'
                  }}>
                    💡 <strong>Tip:</strong> Make sure your screenshot clearly shows the transaction details, amount, reference number, and recipient name.
                  </p>
                </div>
              </div>

              <button 
                type="submit" 
                className="checkout-submit-btn"
                disabled={isProcessing}
              >
                {isProcessing ? 'PROCESSING...' : 'SUBMIT ORDER FOR VERIFICATION'}
              </button>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="checkout-summary">
            <h3 className="checkout-section-title">ORDER SUMMARY</h3>
            
            <div className="checkout-items">
              {items.map((item, idx) => (
                <div key={idx} className="checkout-item">
                  <div className="checkout-item-img">
                    <img src={item.images?.[0] || '/images/logo.png'} alt={item.name} />
                    <span className="checkout-item-qty">{item.quantity}</span>
                  </div>
                  <div className="checkout-item-info">
                    <div className="checkout-item-name">{item.name}</div>
                    <div className="checkout-item-details">
                      <div style={{marginBottom:'4px'}}>
                        <span style={{fontWeight:'600',color:'var(--text)'}}>Size:</span> {item.size}
                      </div>
                      {item.color && (
                        <div style={{marginBottom:'4px'}}>
                          <span style={{fontWeight:'600',color:'var(--text)'}}>Color:</span> {item.color}
                        </div>
                      )}
                      <div>
                        <span style={{fontWeight:'600',color:'var(--text)'}}>Quantity:</span> {item.quantity}
                      </div>
                    </div>
                    <div style={{marginTop:'8px',fontSize:'13px',color:'var(--text-secondary)'}}>
                      ₱{item.price.toLocaleString()} × {item.quantity}
                    </div>
                  </div>
                  <div className="checkout-item-price">
                    ₱{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-totals">
              <div className="checkout-total-row">
                <span>Subtotal</span>
                <span>₱{subtotal.toLocaleString()}</span>
              </div>
              <div className="checkout-total-row checkout-total-final">
                <span>Total</span>
                <span>₱{finalTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
