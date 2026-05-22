'use client';
import { useState, useEffect } from 'react';
import { sampleProducts, sampleBlogPosts } from '@/data/seed';
import { useProducts } from '@/context/ProductContext';
import Notification from '@/components/Notification';
import ConfirmDialog from '@/components/ConfirmDialog';
import AlertModal from '@/components/AlertModal';
import { db } from '@/lib/firebase';
import { doc, collection, onSnapshot } from 'firebase/firestore';

export default function AdminPage() {
  const { products, setAllProducts } = useProducts();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [alertModal, setAlertModal] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  
  // Story content state
  const [storyContent, setStoryContent] = useState({
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
  });

  const [editingStorySection, setEditingStorySection] = useState(null);
  const [showStorySectionModal, setShowStorySectionModal] = useState(false);
  const [isAddingNewSection, setIsAddingNewSection] = useState(false);
  const [editingSectionIndex, setEditingSectionIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Blog posts state
  const [blogPosts, setBlogPosts] = useState(sampleBlogPosts);
  const [editingBlogPost, setEditingBlogPost] = useState(null);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [isAddingNewBlog, setIsAddingNewBlog] = useState(false);
  
  // Profile/Settings state
  const [profileData, setProfileData] = useState({
    gcashName: '6SIX9INE CLOTHING',
    gcashNumber: '0912 345 6789',
    gcashQR: '', // GCash QR code image
    bankName: 'BDO',
    bankAccountName: '6SIX9INE CLOTHING',
    bankAccountNumber: '1234567890',
    email: 'admin@6six9ine.com',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Real-time listener for orders from Firestore
  useEffect(() => {
    console.log('🔥 Setting up real-time orders listener...');
    
    const ordersCollection = collection(db, 'orders');
    
    // Set up real-time listener for the collection
    const unsubscribe = onSnapshot(
      ordersCollection,
      (querySnapshot) => {
        const ordersData = [];
        querySnapshot.forEach((doc) => {
          ordersData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        console.log('🔄 Real-time update: Orders loaded from Firestore:', ordersData.length);
        setOrders(ordersData);
        setIsLoadingOrders(false);
      },
      (error) => {
        console.error('❌ Firestore orders listener error:', error);
        setOrders([]);
        setIsLoadingOrders(false);
      }
    );

    // Cleanup listener on unmount
    return () => {
      console.log('🔌 Disconnecting orders listener');
      unsubscribe();
    };
  }, []);

  // Load story content from API on mount
  useEffect(() => {
    const loadStory = async () => {
      try {
        const response = await fetch('/api/story');
        if (response.ok) {
          const data = await response.json();
          setStoryContent(data);
          console.log('🚀 Admin: Story content loaded from Firebase');
        }
      } catch (error) {
        console.error('Failed to load story content:', error);
      }
    };
    
    loadStory();
  }, []);

  // Load blog posts from API on mount
  useEffect(() => {
    const loadBlog = async () => {
      try {
        const response = await fetch('/api/blog');
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setBlogPosts(data);
            console.log('🚀 Admin: Blog posts loaded from Firebase');
          }
        }
      } catch (error) {
        console.error('Failed to load blog posts:', error);
      }
    };
    
    loadBlog();
  }, []);

  // Load profile data from API on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
          console.log('🚀 Admin: Profile data loaded from Firebase');
        }
      } catch (error) {
        console.error('Failed to load profile data:', error);
      }
    };
    
    loadProfile();
  }, []);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);

    // Compress image helper function
    const compressImage = (file, maxWidth = 1200, quality = 0.7) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Resize if too large
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to compressed base64
            const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedBase64);
          };
          img.onerror = reject;
          img.src = event.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    try {
      const imagePromises = files.map(file => compressImage(file));
      const imageUrls = await Promise.all(imagePromises);
      
      // Create color variants for new images (store as strings, not objects)
      const currentVariants = editingProduct.colorVariants || [];
      const newVariants = imageUrls.map(() => ''); // Empty strings to be filled by admin
      
      setEditingProduct({
        ...editingProduct,
        images: [...(editingProduct.images || []), ...imageUrls],
        colorVariants: [...currentVariants, ...newVariants]
      });
      showNotification(`${files.length} image(s) compressed and uploaded!`, 'success');
      console.log('✅ Product images compressed and ready to save');
    } catch (error) {
      console.error('Error uploading images:', error);
      showNotification('Error uploading images', 'error');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    const newImages = editingProduct.images.filter((_, i) => i !== index);
    const newVariants = (editingProduct.colorVariants || []).filter((_, i) => i !== index);
    setEditingProduct({
      ...editingProduct, 
      images: newImages,
      colorVariants: newVariants
    });
  };

  // Color mapping system - maps color names to hex codes
  const colorMap = {
    // Grayscale
    'Black': '#000000',
    'Charcoal': '#36454F',
    'Dark Gray': '#A9A9A9',
    'Gray': '#808080',
    'Grey': '#808080',
    'Light Gray': '#D3D3D3',
    'Silver': '#C0C0C0',
    'Off White': '#FAF9F6',
    'Ivory': '#FFFFF0',
    'White': '#FFFFFF',
    
    // Reds & Pinks
    'Maroon': '#800000',
    'Burgundy': '#800020',
    'Red': '#DC143C',
    'Crimson': '#DC143C',
    'Coral': '#FF7F50',
    'Salmon': '#FA8072',
    'Pink': '#FFC0CB',
    'Hot Pink': '#FF69B4',
    'Rose': '#FF007F',
    
    // Oranges & Yellows
    'Orange': '#FFA500',
    'Peach': '#FFE5B4',
    'Gold': '#FFD700',
    'Yellow': '#FFD700',
    'Mustard': '#FFDB58',
    'Cream': '#FFFDD0',
    
    // Greens
    'Olive': '#808000',
    'Khaki': '#F0E68C',
    'Lime': '#00FF00',
    'Green': '#008000',
    'Forest Green': '#228B22',
    'Mint': '#98FF98',
    'Teal': '#008080',
    'Turquoise': '#40E0D0',
    'Cyan': '#00FFFF',
    
    // Blues
    'Navy': '#000080',
    'Blue': '#0000FF',
    'Royal Blue': '#4169E1',
    'Sky Blue': '#87CEEB',
    'Light Blue': '#ADD8E6',
    
    // Purples
    'Indigo': '#4B0082',
    'Purple': '#800080',
    'Violet': '#EE82EE',
    'Lavender': '#E6E6FA',
    'Magenta': '#FF00FF',
    
    // Browns & Tans
    'Brown': '#8B4513',
    'Tan': '#D2B48C',
    'Beige': '#F5F5DC',
    'Camel': '#C19A6B',
    'Sand': '#C2B280',
  };

  // Get hex color from color name
  const getColorHex = (colorName) => {
    if (!colorName) return '#CCCCCC'; // Default gray for empty
    const normalized = colorName.trim();
    // Check if it's already a hex color
    if (normalized.startsWith('#')) return normalized;
    // Look up in color map (case insensitive)
    const found = Object.keys(colorMap).find(
      key => key.toLowerCase() === normalized.toLowerCase()
    );
    return found ? colorMap[found] : '#CCCCCC';
  };

  // Update color variant (store as string, not object)
  const updateColorVariant = (index, color) => {
    const newVariants = [...(editingProduct.colorVariants || [])];
    newVariants[index] = color; // Store as string directly
    setEditingProduct({
      ...editingProduct,
      colorVariants: newVariants
    });
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const showConfirm = (message, onConfirm) => {
    setConfirmDialog({ message, onConfirm });
  };

  const handleLogout = () => {
    showConfirm('Are you sure you want to logout?', () => {
      localStorage.removeItem('tempAdminUser');
      window.location.href = '/';
    });
  };

  const totalProducts = products.length;
  const inStockCount = products.filter(p => p.inStock).length;
  const outOfStockCount = products.filter(p => !p.inStock).length;
  const lowStockCount = products.filter(p => p.inStock && (p.quantity || 0) <= 5).length;
  
  // Calculate total inventory value (price × quantity)
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * (p.quantity || 0)), 0);
  
  // Calculate catalog value by category
  const catalogByCategory = products.reduce((acc, p) => {
    const category = p.category || 'uncategorized';
    if (!acc[category]) {
      acc[category] = {
        count: 0,
        totalValue: 0,
        inStock: 0,
        outOfStock: 0,
        totalQuantity: 0
      };
    }
    acc[category].count += 1;
    acc[category].totalValue += p.price * (p.quantity || 0);
    acc[category].totalQuantity += (p.quantity || 0);
    if (p.inStock) acc[category].inStock += 1;
    else acc[category].outOfStock += 1;
    return acc;
  }, {});
  
  // Orders statistics
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'completed');
  const processingOrders = orders.filter(o => o.status === 'processing');
  const pendingOrders = orders.filter(o => o.status === 'pending');
  
  const totalRevenue = completedOrders.reduce((s, o) => s + o.total, 0);
  const processingRevenue = processingOrders.reduce((s, o) => s + o.total, 0);
  const pendingRevenue = pendingOrders.reduce((s, o) => s + o.total, 0);
  
  // Average order value
  const avgOrderValue = totalOrders > 0 ? totalRevenue / completedOrders.length : 0;
  
  // Generate CSV report
  const generateInventoryReport = () => {
    const headers = ['Product Name', 'Category', 'Price', 'Quantity', 'Total Value', 'Status', 'Featured', 'New Drop'];
    const rows = products.map(p => [
      p.name,
      p.category,
      p.price,
      p.quantity || 0,
      p.price * (p.quantity || 0),
      p.inStock ? 'In Stock' : 'Out of Stock',
      p.featured ? 'Yes' : 'No',
      p.isNewDrop ? 'Yes' : 'No'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification('Inventory report downloaded!', 'success');
  };
  
  const generateSalesReport = (filterMonth = 'all') => {
    let filteredOrders = orders;
    
    // Filter by month if specified
    if (filterMonth === 'current') {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      filteredOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      });
    } else if (filterMonth !== 'all') {
      // filterMonth format: 'YYYY-MM'
      const [year, month] = filterMonth.split('-').map(Number);
      filteredOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.getMonth() === month - 1 && orderDate.getFullYear() === year;
      });
    }
    
    const headers = ['Order ID', 'Customer', 'Email', 'Phone', 'Total', 'Status', 'Payment Method', 'Date'];
    const rows = filteredOrders.map(o => [
      o.id,
      o.customerName,
      o.email,
      o.phone,
      o.total,
      o.status,
      o.paymentMethod,
      new Date(o.createdAt).toLocaleString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    const monthLabel = filterMonth === 'all' ? 'all' : filterMonth === 'current' ? 'current-month' : filterMonth;
    a.href = url;
    a.download = `sales-report-${monthLabel}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification(`Sales report downloaded! (${filteredOrders.length} orders)`, 'success');
  };

  const getStatusColor = (status) => {
    if (status === 'completed') return 'var(--success)';
    if (status === 'processing') return 'var(--accent)';
    return 'var(--text-secondary)';
  };

  const handleEditProduct = (product) => {
    setEditingProduct({...product});
    setIsAddingNew(false);
    setShowProductModal(true);
  };

  const handleAddProduct = () => {
    setEditingProduct({
      slug: '',
      name: '',
      category: 'tops',
      price: 0,
      comparePrice: null,
      description: '',
      details: [],
      sizes: [], // Will be populated by checkboxes
      unavailableSizes: [],
      images: [],
      colorVariants: [], // Array of {color: 'Black', image: 'base64...'}
      inStock: true,
      featured: false,
      isNewDrop: false,
      quantity: 0, // Total stock quantity
      createdAt: new Date().toISOString(),
    });
    setIsAddingNew(true);
    setShowProductModal(true);
  };

  const handleSaveProduct = async () => {
    if (editingProduct) {
      // Validate required fields
      if (!editingProduct.name || !editingProduct.slug || editingProduct.images.length === 0) {
        setAlertModal({ message: 'Please fill in all required fields (Name, Slug, and at least one image)', type: 'warning' });
        return;
      }

      // CRITICAL: Always sync inStock flag with quantity before saving
      const productToSave = {
        ...editingProduct,
        inStock: (editingProduct.quantity || 0) > 0
      };

      console.log('💾 Saving product:', productToSave.name, 'Quantity:', productToSave.quantity, 'InStock:', productToSave.inStock);

      let updatedProducts;
      if (isAddingNew) {
        // Check if slug already exists
        if (products.find(p => p.slug === editingProduct.slug)) {
          setAlertModal({ message: 'A product with this slug already exists!', type: 'error' });
          return;
        }
        // Add new product
        updatedProducts = [...products, productToSave];
        showNotification('Product added successfully!', 'success');
      } else {
        // Update existing product
        updatedProducts = products.map(p => 
          p.slug === editingProduct.slug ? productToSave : p
        );
        showNotification('Product updated successfully!', 'success');
      }
      
      // Update state
      setAllProducts(updatedProducts);
      
      // IMMEDIATELY save to Firebase (don't wait for useEffect)
      try {
        console.log('🔥 Immediately saving to Firebase...');
        console.log('📦 Products to save:', updatedProducts.length);
        
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProducts)
        });
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('❌ Server error:', errorData);
          throw new Error(errorData.details || errorData.error || 'Failed to save');
        }
        
        const result = await response.json();
        console.log('✅ Product saved to Firebase immediately:', result);
        // Success - no alert modal needed
      } catch (error) {
        console.error('❌ Failed to save product to Firebase:', error);
        console.error('❌ Error stack:', error.stack);
        setAlertModal({ message: 'Failed to save product. Please try again.', type: 'error' });
      }
      
      setShowProductModal(false);
      setEditingProduct(null);
      setIsAddingNew(false);
    }
  };

  const handleDeleteProduct = (slug) => {
    showConfirm('Are you sure you want to delete this product?', () => {
      setAllProducts(products.filter(p => p.slug !== slug));
      showNotification('Product deleted successfully!', 'delete');
      setConfirmDialog(null);
    });
  };

  const toggleFeatured = (slug) => {
    const updatedProducts = products.map(p => 
      p.slug === slug ? {...p, featured: !p.featured} : p
    );
    console.log('⭐ Toggling featured for:', slug);
    setAllProducts(updatedProducts);
  };

  const toggleNewDrop = (slug) => {
    const updatedProducts = products.map(p => 
      p.slug === slug ? {...p, isNewDrop: !p.isNewDrop} : p
    );
    console.log('🆕 Toggling new drop for:', slug);
    setAllProducts(updatedProducts);
  };

  const toggleStock = (slug) => {
    setAllProducts(products.map(p => 
      p.slug === slug ? {...p, inStock: !p.inStock} : p
    ));
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      
      if (response.ok) {
        showNotification('Profile updated successfully!', 'success');
        console.log('💾 Profile saved to Firebase');
      } else {
        throw new Error('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setAlertModal({ message: 'Failed to save profile data', type: 'error' });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlertModal({ message: 'New passwords do not match!', type: 'error' });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setAlertModal({ message: 'Password must be at least 6 characters long!', type: 'warning' });
      return;
    }
    
    // Save email and password via API
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      
      if (response.ok) {
        showNotification('Email and password updated successfully!', 'success');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        console.log('💾 Password updated in Firebase');
      } else {
        throw new Error('Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setAlertModal({ message: 'Failed to update password', type: 'error' });
    }
  };

  // Story management functions
  const handleStoryUpdate = async () => {
    try {
      const response = await fetch('/api/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storyContent)
      });
      
      if (response.ok) {
        showNotification('Story content saved successfully!', 'success');
        console.log('💾 Story saved to Firebase');
      } else {
        throw new Error('Failed to save story');
      }
    } catch (error) {
      console.error('Error saving story:', error);
      setAlertModal({ message: 'Failed to save story content', type: 'error' });
    }
  };

  const updateStorySection = (index, field, value) => {
    const newSections = [...storyContent.sections];
    newSections[index][field] = value;
    setStoryContent({...storyContent, sections: newSections});
  };

  const handleAddStorySection = () => {
    setEditingStorySection({
      title: '',
      content: '',
      image: ''
    });
    setIsAddingNewSection(true);
    setShowStorySectionModal(true);
  };

  const handleEditStorySection = (index) => {
    setEditingStorySection({...storyContent.sections[index]});
    setEditingSectionIndex(index);
    setIsAddingNewSection(false);
    setShowStorySectionModal(true);
  };

  const handleSaveStorySection = async () => {
    if (!editingStorySection.title || !editingStorySection.content) {
      setAlertModal({ message: 'Please fill in title and content', type: 'warning' });
      return;
    }

    let updatedContent;

    if (isAddingNewSection) {
      // Add new section to the bottom
      const newSections = [...storyContent.sections, editingStorySection];
      updatedContent = {...storyContent, sections: newSections};
      setStoryContent(updatedContent);
      showNotification('Section added successfully!', 'success');
    } else {
      // Update existing section
      const newSections = [...storyContent.sections];
      newSections[editingSectionIndex] = editingStorySection;
      updatedContent = {...storyContent, sections: newSections};
      setStoryContent(updatedContent);
      showNotification('Section updated successfully!', 'success');
    }

    // Save to Firebase via API
    try {
      const response = await fetch('/api/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save story');
      }
      
      console.log('💾 Story section saved to Firebase');
    } catch (error) {
      console.error('Failed to save story content:', error);
      setAlertModal({ 
        message: 'Failed to save story section. Please try again.', 
        type: 'error' 
      });
      return;
    }

    setShowStorySectionModal(false);
    setEditingStorySection(null);
    setIsAddingNewSection(false);
    setEditingSectionIndex(null);
  };

  const handleRemoveStorySection = async (index) => {
    if (storyContent.sections.length <= 1) {
      showNotification('You must have at least one section!', 'error');
      return;
    }
    showConfirm('Are you sure you want to delete this section?', async () => {
      const newSections = storyContent.sections.filter((_, i) => i !== index);
      const updatedContent = {...storyContent, sections: newSections};
      setStoryContent(updatedContent);
      
      // Save to Firebase via API
      try {
        const response = await fetch('/api/story', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedContent)
        });
        
        if (response.ok) {
          console.log('💾 Story section deleted and saved to Firebase');
          showNotification('Section deleted successfully!', 'delete');
        }
      } catch (error) {
        console.error('Failed to save story:', error);
      }
      
      setConfirmDialog(null);
    });
  };

  const handleStorySectionImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Compress image before converting to base64
    const compressImage = (file, maxWidth = 1200, quality = 0.7) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Resize if too large
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to compressed base64
            const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedBase64);
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    };

    try {
      const compressedImage = await compressImage(file);
      setEditingStorySection({...editingStorySection, image: compressedImage});
      console.log('✅ Image compressed and ready to save');
    } catch (error) {
      console.error('Failed to compress image:', error);
      setAlertModal({ message: 'Failed to process image', type: 'error' });
    }
  };

  const handleBlogImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Compress image before converting to base64
    const compressImage = (file, maxWidth = 1200, quality = 0.7) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Resize if too large
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to compressed base64
            const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedBase64);
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    };

    try {
      const compressedImage = await compressImage(file);
      setEditingBlogPost({...editingBlogPost, coverImage: compressedImage});
      console.log('✅ Blog image compressed and ready to save');
    } catch (error) {
      console.error('Failed to compress image:', error);
      setAlertModal({ message: 'Failed to process image', type: 'error' });
    }
  };

  const handleGCashQRUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Compress QR code image
    const compressImage = (file, maxWidth = 600, quality = 0.8) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Resize if too large (QR codes should be smaller)
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to compressed base64
            const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedBase64);
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    };

    try {
      const compressedImage = await compressImage(file);
      setProfileData({...profileData, gcashQR: compressedImage});
      showNotification('GCash QR code uploaded successfully!', 'success');
      console.log('✅ GCash QR compressed and ready to save');
    } catch (error) {
      console.error('Failed to compress QR image:', error);
      setAlertModal({ message: 'Failed to process QR code image', type: 'error' });
    }
  };

  // Blog management functions
  const handleAddBlogPost = () => {
    setEditingBlogPost({
      slug: '',
      title: '',
      excerpt: '',
      content: '',
      coverImage: '',
      author: '6six9ine',
      createdAt: new Date().toISOString(),
    });
    setIsAddingNewBlog(true);
    setShowBlogModal(true);
  };

  const handleEditBlogPost = (post) => {
    setEditingBlogPost({...post});
    setIsAddingNewBlog(false);
    setShowBlogModal(true);
  };

  const handleSaveBlogPost = async () => {
    if (!editingBlogPost.title || !editingBlogPost.slug) {
      setAlertModal({ message: 'Please fill in title and slug', type: 'warning' });
      return;
    }

    if (isAddingNewBlog) {
      if (blogPosts.find(p => p.slug === editingBlogPost.slug)) {
        setAlertModal({ message: 'A blog post with this slug already exists!', type: 'error' });
        return;
      }
      const newPosts = [...blogPosts, editingBlogPost];
      setBlogPosts(newPosts);
      
      // Save to Firebase via API
      try {
        const response = await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPosts)
        });
        
        if (response.ok) {
          showNotification('Blog post added successfully!', 'success');
          console.log('💾 Blog post added to Firebase');
        } else {
          throw new Error('Failed to save blog post');
        }
      } catch (error) {
        console.error('Error saving blog post:', error);
        setAlertModal({ message: 'Failed to save blog post', type: 'error' });
        return;
      }
    } else {
      const updatedPosts = blogPosts.map(p => 
        p.slug === editingBlogPost.slug ? editingBlogPost : p
      );
      setBlogPosts(updatedPosts);
      
      // Save to Firebase via API
      try {
        const response = await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPosts)
        });
        
        if (response.ok) {
          showNotification('Blog post updated successfully!', 'success');
          console.log('💾 Blog post updated in Firebase');
        } else {
          throw new Error('Failed to update blog post');
        }
      } catch (error) {
        console.error('Error updating blog post:', error);
        setAlertModal({ message: 'Failed to update blog post', type: 'error' });
        return;
      }
    }
    
    setShowBlogModal(false);
    setEditingBlogPost(null);
    setIsAddingNewBlog(false);
  };

  const handleDeleteBlogPost = (slug) => {
    showConfirm('Are you sure you want to delete this blog post?', async () => {
      const updatedPosts = blogPosts.filter(p => p.slug !== slug);
      setBlogPosts(updatedPosts);
      
      // Save to Firebase via API
      try {
        const response = await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPosts)
        });
        
        if (response.ok) {
          showNotification('Blog post deleted successfully!', 'delete');
          console.log('💾 Blog post deleted from Firebase');
        } else {
          throw new Error('Failed to delete blog post');
        }
      } catch (error) {
        console.error('Error deleting blog post:', error);
        setAlertModal({ message: 'Failed to delete blog post', type: 'error' });
      }
      
      setConfirmDialog(null);
    });
  };

  // Order management functions
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(orders.map(o => 
          o.id === orderId ? updatedOrder : o
        ));
        showNotification(`Order ${orderId} status updated to ${newStatus}!`, 'success');
        console.log('💾 Order status updated in Firebase');
      } else {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setAlertModal({ message: 'Failed to update order status', type: 'error' });
    }
  };

  const getPaymentMethodDisplay = (method) => {
    const methods = {
      cod: { icon: '💵', name: 'Cash on Delivery', color: 'var(--text-secondary)' },
      gcash: { icon: '💙', name: 'GCash', color: '#007DFE' },
      paymaya: { icon: '💚', name: 'PayMaya', color: '#00D632' },
      bank: { icon: '🏦', name: 'Bank Transfer', color: 'var(--accent)' }
    };
    return methods[method] || methods.cod;
  };

  return (
    <div className="admin-layout">
      {alertModal && (
        <AlertModal 
          message={alertModal.message}
          type={alertModal.type}
          onClose={() => setAlertModal(null)}
        />
      )}

      {notification && (
        <Notification 
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {confirmDialog && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
      
      {/* Mobile Menu Toggle */}
      <button 
        className="admin-mobile-toggle"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        aria-label="Toggle menu"
      >
        {showMobileMenu ? '✕' : '☰'}
      </button>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div 
          className="admin-mobile-overlay"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`admin-sidebar ${showMobileMenu ? 'mobile-open' : ''}`}>
        {/* Logo */}
        <div className="admin-sidebar-logo">
          <img src="/images/logo.png" alt="6six9ine" />
        </div>

        {/* Navigation */}
        <nav className="admin-sidebar-nav">
          <button 
            className={`admin-sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dashboard'); setShowMobileMenu(false); }}
          >
            <span className="admin-nav-text">Dashboard</span>
          </button>
          <button 
            className={`admin-sidebar-link ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => { setActiveTab('products'); setShowMobileMenu(false); }}
          >
            <span className="admin-nav-text">Products</span>
          </button>
          <button 
            className={`admin-sidebar-link ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => { setActiveTab('orders'); setShowMobileMenu(false); }}
          >
            <span className="admin-nav-text">Orders</span>
          </button>
          <button 
            className={`admin-sidebar-link ${activeTab === 'story' ? 'active' : ''}`}
            onClick={() => { setActiveTab('story'); setShowMobileMenu(false); }}
          >
            <span className="admin-nav-text">Story</span>
          </button>
          <button 
            className={`admin-sidebar-link ${activeTab === 'blog' ? 'active' : ''}`}
            onClick={() => { setActiveTab('blog'); setShowMobileMenu(false); }}
          >
            <span className="admin-nav-text">Blog</span>
          </button>
          <button 
            className={`admin-sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => { setActiveTab('profile'); setShowMobileMenu(false); }}
          >
            <span className="admin-nav-text">Profile</span>
          </button>
        </nav>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="admin-sidebar-logout"
        >
          <span className="admin-nav-text">Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <div className="container">

        {activeTab === 'dashboard' && (
          <>
            <div className="admin-section-header" style={{marginBottom:'32px'}}>
              <h2>DASHBOARD OVERVIEW</h2>
            </div>
            
            {/* Main Stats Grid */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-icon">📦</div>
                <div className="admin-stat-content">
                  <div className="admin-stat-label">Total Products</div>
                  <div className="admin-stat-value">{totalProducts}</div>
                  <div className="admin-stat-detail">{inStockCount} in stock • {outOfStockCount} out</div>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon">💰</div>
                <div className="admin-stat-content">
                  <div className="admin-stat-label">Total Revenue</div>
                  <div className="admin-stat-value">₱{totalRevenue.toLocaleString()}</div>
                  <div className="admin-stat-detail">From {completedOrders.length} completed orders</div>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon">🛒</div>
                <div className="admin-stat-content">
                  <div className="admin-stat-label">Pending Orders</div>
                  <div className="admin-stat-value">{pendingOrders.length}</div>
                  <div className="admin-stat-detail">₱{pendingRevenue.toLocaleString()} pending</div>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon">📊</div>
                <div className="admin-stat-content">
                  <div className="admin-stat-label">Catalog Value</div>
                  <div className="admin-stat-value">₱{totalInventoryValue.toLocaleString()}</div>
                  <div className="admin-stat-detail">Total inventory value</div>
                </div>
              </div>
            </div>

            {/* Order Statistics */}
            <div className="admin-section" style={{marginTop:'32px'}}>
              <h2 style={{fontFamily:'Bebas Neue',fontSize:'24px',letterSpacing:'3px',marginBottom:'24px',display:'flex',alignItems:'center',gap:'12px'}}>
                <span>💰</span> ORDER STATISTICS
              </h2>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:'16px'}}>
                <div className="admin-quick-stat" style={{background:'rgba(46, 204, 113, 0.1)',border:'1px solid var(--success)'}}>
                  <div className="admin-quick-stat-label" style={{color:'var(--success)'}}>Completed Orders</div>
                  <div className="admin-quick-stat-value" style={{color:'var(--success)'}}>{completedOrders.length}</div>
                  <div style={{fontSize:'12px',color:'var(--success)',marginTop:'8px'}}>₱{totalRevenue.toLocaleString()}</div>
                </div>
                <div className="admin-quick-stat" style={{background:'rgba(212, 168, 67, 0.1)',border:'1px solid var(--accent)'}}>
                  <div className="admin-quick-stat-label" style={{color:'var(--accent)'}}>Processing Orders</div>
                  <div className="admin-quick-stat-value" style={{color:'var(--accent)'}}>{processingOrders.length}</div>
                  <div style={{fontSize:'12px',color:'var(--accent)',marginTop:'8px'}}>₱{processingRevenue.toLocaleString()}</div>
                </div>
                <div className="admin-quick-stat" style={{background:'rgba(231, 76, 60, 0.1)',border:'1px solid var(--danger)'}}>
                  <div className="admin-quick-stat-label" style={{color:'var(--danger)'}}>Pending Orders</div>
                  <div className="admin-quick-stat-value" style={{color:'var(--danger)'}}>{pendingOrders.length}</div>
                  <div style={{fontSize:'12px',color:'var(--danger)',marginTop:'8px'}}>₱{pendingRevenue.toLocaleString()}</div>
                </div>
                <div className="admin-quick-stat">
                  <div className="admin-quick-stat-label">Average Order</div>
                  <div className="admin-quick-stat-value">₱{Math.round(avgOrderValue).toLocaleString()}</div>
                  <div style={{fontSize:'12px',color:'var(--text-secondary)',marginTop:'8px'}}>Per completed order</div>
                </div>
              </div>
            </div>

            {/* Inventory Alerts - Compact Design */}
            <div className="admin-section" style={{marginTop:'32px'}}>
              <h2 style={{fontFamily:'Bebas Neue',fontSize:'20px',letterSpacing:'2px',marginBottom:'16px',display:'flex',alignItems:'center',gap:'8px'}}>
                <span>⚠️</span> INVENTORY ALERTS
              </h2>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                <div style={{background:'rgba(241, 196, 15, 0.1)',border:'1px solid var(--accent)',borderRadius:'6px',padding:'12px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                    <span style={{fontSize:'20px'}}>⚠️</span>
                    <div>
                      <div style={{fontSize:'10px',color:'var(--accent)',letterSpacing:'1px',fontWeight:'700'}}>LOW STOCK</div>
                      <div style={{fontSize:'18px',fontWeight:'700',color:'var(--accent)'}}>{lowStockCount}</div>
                    </div>
                  </div>
                  <div style={{marginTop:'6px',display:'flex',flexWrap:'wrap',gap:'4px'}}>
                    {products.filter(p => (p.quantity || 0) < 10 && (p.quantity || 0) > 0).slice(0, 5).map(p => (
                      <span key={p.slug} style={{
                        fontSize:'9px',
                        padding:'2px 6px',
                        background:'var(--bg-card)',
                        border:'1px solid var(--accent)',
                        borderRadius:'3px',
                        color:'var(--accent)'
                      }}>
                        {p.name} ({p.quantity})
                      </span>
                    ))}
                    {products.filter(p => (p.quantity || 0) < 10 && (p.quantity || 0) > 0).length > 5 && (
                      <span style={{fontSize:'9px',color:'var(--text-muted)'}}>
                        +{products.filter(p => (p.quantity || 0) < 10 && (p.quantity || 0) > 0).length - 5} more
                      </span>
                    )}
                  </div>
                </div>
                <div style={{background:'rgba(231, 76, 60, 0.1)',border:'1px solid var(--danger)',borderRadius:'6px',padding:'12px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                    <span style={{fontSize:'20px'}}>✗</span>
                    <div>
                      <div style={{fontSize:'10px',color:'var(--danger)',letterSpacing:'1px',fontWeight:'700'}}>OUT OF STOCK</div>
                      <div style={{fontSize:'18px',fontWeight:'700',color:'var(--danger)'}}>{outOfStockCount}</div>
                    </div>
                  </div>
                  <div style={{marginTop:'6px',display:'flex',flexWrap:'wrap',gap:'4px'}}>
                    {products.filter(p => (p.quantity || 0) === 0).slice(0, 5).map(p => (
                      <span key={p.slug} style={{
                        fontSize:'9px',
                        padding:'2px 6px',
                        background:'var(--bg-card)',
                        border:'1px solid var(--danger)',
                        borderRadius:'3px',
                        color:'var(--danger)'
                      }}>
                        {p.name}
                      </span>
                    ))}
                    {products.filter(p => (p.quantity || 0) === 0).length > 5 && (
                      <span style={{fontSize:'9px',color:'var(--text-muted)'}}>
                        +{products.filter(p => (p.quantity || 0) === 0).length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="admin-section" style={{marginTop:'32px'}}>
              <div className="admin-section-header">
                <h2>RECENT ORDERS</h2>
                <button className="admin-btn-primary" onClick={() => setActiveTab('orders')}>View All Orders</button>
              </div>
              <div className="admin-table-container">
                <table className="admin-table-modern">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(order => (
                      <tr key={order.id}>
                        <td><span className="admin-order-id">{order.id}</span></td>
                        <td>{order.customerName}</td>
                        <td className="admin-price">₱{order.total.toLocaleString()}</td>
                        <td>
                          <span className="admin-status-badge" style={{background: getStatusColor(order.status)}}>
                            {order.status}
                          </span>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button className="admin-btn-small" onClick={() => {handleViewOrder(order); setActiveTab('orders');}}>View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'products' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>
                ALL PRODUCTS ({products.filter(p => {
                  const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.category.toLowerCase().includes(searchQuery.toLowerCase());
                  return matchesSearch;
                }).length})
              </h2>
              <button className="admin-btn-primary" onClick={handleAddProduct}>+ Add Product</button>
            </div>

            {/* Low Stock Warning */}
            {products.filter(p => (p.quantity || 0) < 10 && (p.quantity || 0) > 0).length > 0 && (
              <div style={{
                padding:'10px 14px',
                background:'rgba(241, 196, 15, 0.1)',
                border:'1px solid var(--accent)',
                borderRadius:'6px',
                marginBottom:'16px',
                display:'flex',
                alignItems:'center',
                gap:'10px'
              }}>
                <span style={{fontSize:'20px'}}>⚠️</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:'12px',fontWeight:'600',color:'var(--accent)',marginBottom:'4px'}}>
                    LOW STOCK WARNING
                  </div>
                  <div style={{fontSize:'11px',color:'var(--text-secondary)'}}>
                    {products.filter(p => (p.quantity || 0) < 10 && (p.quantity || 0) > 0).length} product(s) have low stock (below 10 items). Consider restocking soon to avoid running out.
                  </div>
                  <div style={{marginTop:'6px',display:'flex',flexWrap:'wrap',gap:'6px'}}>
                    {products.filter(p => (p.quantity || 0) < 10 && (p.quantity || 0) > 0).map(p => (
                      <span key={p.slug} style={{
                        fontSize:'10px',
                        padding:'2px 6px',
                        background:'var(--bg-card)',
                        border:'1px solid var(--border)',
                        borderRadius:'3px',
                        color:'var(--text-secondary)'
                      }}>
                        {p.name}: {p.quantity} left
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Out of Stock Warning */}
            {products.filter(p => (p.quantity || 0) === 0).length > 0 && (
              <div style={{
                padding:'10px 14px',
                background:'rgba(231, 76, 60, 0.1)',
                border:'1px solid var(--danger)',
                borderRadius:'6px',
                marginBottom:'16px',
                display:'flex',
                alignItems:'center',
                gap:'10px'
              }}>
                <span style={{fontSize:'20px'}}>🚨</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:'12px',fontWeight:'600',color:'var(--danger)',marginBottom:'4px'}}>
                    OUT OF STOCK ALERT
                  </div>
                  <div style={{fontSize:'11px',color:'var(--text-secondary)'}}>
                    {products.filter(p => (p.quantity || 0) === 0).length} product(s) are completely out of stock. Restock immediately to continue selling.
                  </div>
                  <div style={{marginTop:'6px',display:'flex',flexWrap:'wrap',gap:'6px'}}>
                    {products.filter(p => (p.quantity || 0) === 0).map(p => (
                      <span key={p.slug} style={{
                        fontSize:'10px',
                        padding:'2px 6px',
                        background:'var(--bg-card)',
                        border:'1px solid var(--danger)',
                        borderRadius:'3px',
                        color:'var(--danger)',
                        fontWeight:'600'
                      }}>
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Search Bar */}
            <div style={{marginBottom:'24px'}}>
              <div style={{position:'relative',maxWidth:'400px'}}>
                <span style={{
                  position:'absolute',
                  left:'16px',
                  top:'50%',
                  transform:'translateY(-50%)',
                  fontSize:'18px',
                  color:'var(--text-secondary)'
                }}>
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search products by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width:'100%',
                    padding:'12px 16px 12px 48px',
                    background:'var(--bg-card)',
                    border:'2px solid var(--border)',
                    borderRadius:'8px',
                    color:'var(--text)',
                    fontSize:'14px',
                    outline:'none',
                    transition:'all var(--transition)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      position:'absolute',
                      right:'12px',
                      top:'50%',
                      transform:'translateY(-50%)',
                      background:'none',
                      border:'none',
                      color:'var(--text-secondary)',
                      cursor:'pointer',
                      fontSize:'20px',
                      padding:'4px'
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="admin-table-container">
              <table className="admin-table-modern">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Variants</th>
                    <th>Stock</th>
                    <th>Featured</th>
                    <th>New Drop</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products
                    .filter(p => {
                      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.category.toLowerCase().includes(searchQuery.toLowerCase());
                      return matchesSearch;
                    })
                    .map(p => (
                    <tr key={p.slug}>
                      <td>
                        <div className="admin-product-cell">
                          <div className="admin-product-img">
                            <img src={p.images[0]} alt={p.name} />
                          </div>
                          <span>{p.name}</span>
                        </div>
                      </td>
                      <td><span className="admin-category-badge">{p.category}</span></td>
                      <td className="admin-price">₱{p.price.toLocaleString()}</td>
                      <td>
                        <span style={{
                          fontSize:'14px',
                          fontWeight:'600',
                          color: (p.quantity || 0) === 0 ? 'var(--danger)' : (p.quantity || 0) < 10 ? 'var(--accent)' : 'var(--success)'
                        }}>
                          {p.quantity || 0}
                        </span>
                      </td>
                      <td>
                        <span style={{fontSize:'12px',color:'var(--text-secondary)'}}>
                          {p.images.length} image{p.images.length > 1 ? 's' : ''}
                        </span>
                      </td>
                      <td>
                        <button 
                          onClick={() => toggleStock(p.slug)}
                          style={{
                            background:'none',
                            border:'none',
                            color: (p.quantity || 0) === 0 ? 'var(--danger)' : (p.quantity || 0) < 10 ? 'var(--accent)' : 'var(--success)',
                            cursor:'pointer',
                            fontSize:'14px',
                            fontWeight:'600'
                          }}
                        >
                          {(p.quantity || 0) === 0 ? '✗ Out of Stock' : (p.quantity || 0) < 10 ? '⚠ Low Stock' : '✓ In Stock'}
                        </button>
                      </td>
                      <td>
                        <button 
                          onClick={() => toggleFeatured(p.slug)}
                          style={{
                            background:'none',
                            border:'none',
                            fontSize:'20px',
                            cursor:'pointer',
                            opacity: p.featured ? 1 : 0.3
                          }}
                        >
                          ⭐
                        </button>
                      </td>
                      <td>
                        <button 
                          onClick={() => toggleNewDrop(p.slug)}
                          style={{
                            background: p.isNewDrop ? 'var(--accent)' : 'var(--bg-tertiary)',
                            border: '1px solid var(--border)',
                            color: p.isNewDrop ? 'var(--bg)' : 'var(--text-secondary)',
                            padding: '4px 8px',
                            fontSize: '10px',
                            fontWeight: '700',
                            letterSpacing: '1px',
                            cursor:'pointer',
                            textTransform:'uppercase'
                          }}
                        >
                          {p.isNewDrop ? 'NEW' : 'OLD'}
                        </button>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-btn-small" onClick={() => handleEditProduct(p)}>Edit</button>
                          <button className="admin-btn-small admin-btn-danger" onClick={() => handleDeleteProduct(p.slug)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {activeTab === 'orders' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>ALL ORDERS</h2>
              <div className="admin-filters">
                <select className="admin-select">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
            <div className="admin-table-container">
              <table className="admin-table-modern">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td><span className="admin-order-id">{order.id}</span></td>
                      <td>{order.customer}</td>
                      <td className="admin-price">₱{order.total.toLocaleString()}</td>
                      <td>
                        <span className="admin-status-badge" style={{background: getStatusColor(order.status)}}>
                          {order.status}
                        </span>
                      </td>
                      <td>{order.date}</td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-btn-small" onClick={() => handleViewOrder(order)}>View</button>
                          <button className="admin-btn-small" onClick={() => handleViewOrder(order)}>Update</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'story' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>MANAGE STORY PAGE</h2>
              <button className="admin-btn-primary" onClick={handleAddStorySection}>+ Add Section</button>
            </div>

            <div className="profile-card">
              <h3 className="profile-card-title">HERO SECTION</h3>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Page Title</label>
                  <input 
                    type="text" 
                    value={storyContent.title}
                    onChange={(e) => setStoryContent({...storyContent, title: e.target.value})}
                    placeholder="OUR STORY"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Subtitle</label>
                  <input 
                    type="text" 
                    value={storyContent.subtitle}
                    onChange={(e) => setStoryContent({...storyContent, subtitle: e.target.value})}
                    placeholder="Against All Odds — Since Day One"
                  />
                </div>
              </div>
            </div>

            {storyContent.sections.map((section, index) => (
              <div key={index} className="profile-card">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
                  <h3 className="profile-card-title" style={{marginBottom:0}}>SECTION {index + 1}: {section.title}</h3>
                  <div style={{display:'flex',gap:'8px'}}>
                    <button 
                      className="admin-btn-small"
                      onClick={() => handleEditStorySection(index)}
                    >
                      Edit
                    </button>
                    <button 
                      className="admin-btn-small admin-btn-danger"
                      onClick={() => handleRemoveStorySection(index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div style={{fontSize:'14px',color:'var(--text-secondary)',lineHeight:'1.6'}}>
                  {section.content.substring(0, 150)}...
                </div>
                {section.image && (
                  <div style={{marginTop:'12px'}}>
                    <img src={section.image} alt={section.title} style={{width:'200px',height:'auto',border:'1px solid var(--border)'}} />
                  </div>
                )}
              </div>
            ))}

            <button className="admin-btn-primary" onClick={handleStoryUpdate}>
              Save Story Content
            </button>
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>MANAGE BLOG POSTS ({blogPosts.length})</h2>
              <button className="admin-btn-primary" onClick={handleAddBlogPost}>+ Add Blog Post</button>
            </div>
            <div className="admin-table-container">
              <table className="admin-table-modern">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Slug</th>
                    <th>Author</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogPosts.map(post => (
                    <tr key={post.slug}>
                      <td>{post.title}</td>
                      <td><span style={{fontFamily:'monospace',fontSize:'12px'}}>{post.slug}</span></td>
                      <td>{post.author}</td>
                      <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-btn-small" onClick={() => handleEditBlogPost(post)}>Edit</button>
                          <button className="admin-btn-small admin-btn-danger" onClick={() => handleDeleteBlogPost(post.slug)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>PROFILE & SETTINGS</h2>
            </div>

            {/* GCash Account */}
            <div className="profile-card">
              <h3 className="profile-card-title">GCASH ACCOUNT</h3>
              <p style={{fontSize:'12px',color:'var(--text-secondary)',marginBottom:'16px'}}>
                This information will be displayed to customers when they select GCash payment
              </p>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>GCash Account Name</label>
                  <input 
                    type="text" 
                    value={profileData.gcashName}
                    onChange={(e) => setProfileData({...profileData, gcashName: e.target.value})}
                    placeholder="6SIX9INE CLOTHING"
                  />
                </div>
                <div className="admin-form-group">
                  <label>GCash Number</label>
                  <input 
                    type="text" 
                    value={profileData.gcashNumber}
                    onChange={(e) => setProfileData({...profileData, gcashNumber: e.target.value})}
                    placeholder="0912 345 6789"
                  />
                </div>
              </div>
              
              {/* GCash QR Code Upload */}
              <div className="admin-form-group" style={{marginTop:'20px'}}>
                <label>GCash QR Code (Optional)</label>
                <p style={{fontSize:'11px',color:'var(--text-secondary)',marginBottom:'12px'}}>
                  Upload your GCash QR code so customers can scan to pay directly
                </p>
                <div style={{display:'flex',gap:'16px',alignItems:'flex-start'}}>
                  <label style={{
                    display:'inline-block',
                    padding:'10px 20px',
                    background:'#007DFE',
                    color:'white',
                    borderRadius:'6px',
                    cursor:'pointer',
                    fontSize:'13px',
                    fontWeight:'600',
                    transition:'all var(--transition)'
                  }}>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleGCashQRUpload}
                      style={{display:'none'}}
                    />
                    📷 Upload QR Code
                  </label>
                  {profileData.gcashQR && (
                    <button
                      type="button"
                      onClick={() => setProfileData({...profileData, gcashQR: ''})}
                      style={{
                        padding:'10px 20px',
                        background:'var(--danger)',
                        color:'white',
                        border:'none',
                        borderRadius:'6px',
                        cursor:'pointer',
                        fontSize:'13px',
                        fontWeight:'600'
                      }}
                    >
                      Remove QR
                    </button>
                  )}
                </div>
                {profileData.gcashQR && (
                  <div style={{marginTop:'16px',padding:'16px',background:'white',borderRadius:'8px',display:'inline-block'}}>
                    <img 
                      src={profileData.gcashQR} 
                      alt="GCash QR Code"
                      style={{
                        width:'200px',
                        height:'200px',
                        objectFit:'contain',
                        border:'2px solid #007DFE',
                        borderRadius:'8px'
                      }}
                    />
                  </div>
                )}
              </div>
              
              {/* Save GCash Button */}
              <button 
                className="admin-btn-primary" 
                onClick={handleProfileUpdate}
                style={{marginTop:'20px'}}
              >
                💾 Save GCash Information
              </button>
            </div>

            {/* Bank Account */}
            <div className="profile-card">
              <h3 className="profile-card-title">BANK ACCOUNT</h3>
              <p style={{fontSize:'12px',color:'var(--text-secondary)',marginBottom:'16px'}}>
                This information will be displayed to customers when they select Bank Transfer payment
              </p>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Bank Name</label>
                  <select 
                    value={profileData.bankName}
                    onChange={(e) => setProfileData({...profileData, bankName: e.target.value})}
                  >
                    <option value="BDO">BDO Unibank</option>
                    <option value="BPI">Bank of the Philippine Islands (BPI)</option>
                    <option value="Metrobank">Metrobank</option>
                    <option value="UnionBank">UnionBank</option>
                    <option value="Security Bank">Security Bank</option>
                    <option value="PNB">Philippine National Bank (PNB)</option>
                    <option value="Landbank">Land Bank of the Philippines</option>
                    <option value="RCBC">RCBC</option>
                    <option value="Chinabank">Chinabank</option>
                    <option value="EastWest">EastWest Bank</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Account Name</label>
                  <input 
                    type="text" 
                    value={profileData.bankAccountName}
                    onChange={(e) => setProfileData({...profileData, bankAccountName: e.target.value})}
                    placeholder="6SIX9INE CLOTHING"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Account Number</label>
                  <input 
                    type="text" 
                    value={profileData.bankAccountNumber}
                    onChange={(e) => setProfileData({...profileData, bankAccountNumber: e.target.value})}
                    placeholder="1234567890"
                  />
                </div>
              </div>
              
              {/* Save Bank Button */}
              <button 
                className="admin-btn-primary" 
                onClick={handleProfileUpdate}
                style={{marginTop:'20px'}}
              >
                💾 Save Bank Information
              </button>
            </div>

            {/* Change Password */}
            <div className="profile-card">
              <h3 className="profile-card-title">ACCOUNT SECURITY</h3>
              <form onSubmit={handlePasswordChange}>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      required
                      placeholder="admin@6six9ine.com"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Current Password</label>
                    <input 
                      type="password" 
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      required
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>New Password</label>
                    <input 
                      type="password" 
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      required
                      placeholder="Enter new password"
                      minLength="6"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Confirm New Password</label>
                    <input 
                      type="password" 
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      required
                      placeholder="Confirm new password"
                      minLength="6"
                    />
                  </div>
                </div>
                <button type="submit" className="admin-btn-primary">
                  Update Email & Password
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Product Edit/Add Modal */}
      {showProductModal && editingProduct && (
        <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{isAddingNew ? 'ADD NEW PRODUCT' : 'EDIT PRODUCT'}</h2>
              <button className="modal-close" onClick={() => setShowProductModal(false)}>&times;</button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Product Name *</label>
                  <input 
                    type="text" 
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    placeholder="69 Wave Tee"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Slug (URL) *</label>
                  <input 
                    type="text" 
                    value={editingProduct.slug}
                    onChange={(e) => setEditingProduct({...editingProduct, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                    placeholder="69-wave-tee"
                    disabled={!isAddingNew}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Category *</label>
                  <select 
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                  >
                    <option value="tops">Tops</option>
                    <option value="longsleeve">Longsleeve</option>
                    <option value="mask">Mask</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Stock Quantity *</label>
                  <input 
                    type="number" 
                    value={editingProduct.quantity || 0}
                    onChange={(e) => {
                      const qty = parseInt(e.target.value) || 0;
                      setEditingProduct({
                        ...editingProduct, 
                        quantity: qty,
                        inStock: qty > 0
                      });
                    }}
                    placeholder="100"
                    min="0"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Price (₱) *</label>
                  <input 
                    type="number" 
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: parseInt(e.target.value) || 0})}
                    placeholder="995"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Compare Price (₱)</label>
                  <input 
                    type="number" 
                    value={editingProduct.comparePrice || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, comparePrice: e.target.value ? parseInt(e.target.value) : null})}
                    placeholder="1295"
                  />
                </div>
              </div>
              
              <div className="admin-form-group">
                <label>Description *</label>
                <textarea 
                  rows="3"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  placeholder="Premium heavyweight cotton tee with iconic graphics..."
                />
              </div>

              <div className="admin-form-group">
                <label>Product Details (one per line)</label>
                <textarea 
                  rows="4"
                  value={Array.isArray(editingProduct.details) ? editingProduct.details.join('\n') : ''}
                  onChange={(e) => setEditingProduct({...editingProduct, details: e.target.value.split('\n').filter(d => d.trim())})}
                  placeholder="100% Cotton&#10;220gsm Heavyweight&#10;Oversized Fit"
                />
              </div>

              <div className="admin-form-group">
                <label>Available Sizes (Select sizes to offer)</label>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(80px, 1fr))',gap:'8px',marginTop:'8px'}}>
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'].map(size => (
                    <label key={size} className="admin-size-checkbox">
                      <input 
                        type="checkbox"
                        checked={(editingProduct.sizes || []).includes(size)}
                        onChange={(e) => {
                          const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'];
                          const currentSizes = editingProduct.sizes || [];
                          let newSizes;
                          
                          if (e.target.checked) {
                            // Add size and sort by order
                            newSizes = [...currentSizes, size].sort((a, b) => 
                              sizeOrder.indexOf(a) - sizeOrder.indexOf(b)
                            );
                          } else {
                            // Remove size
                            newSizes = currentSizes.filter(s => s !== size);
                          }
                          
                          setEditingProduct({
                            ...editingProduct, 
                            sizes: newSizes,
                            unavailableSizes: (editingProduct.unavailableSizes || []).filter(s => newSizes.includes(s))
                          });
                        }}
                      />
                      <span>{size}</span>
                    </label>
                  ))}
                </div>
                <small style={{fontSize:'11px',color:'var(--text)',marginTop:'8px',display:'block'}}>
                  Check the sizes you want to offer for this product
                </small>
              </div>

              <div className="admin-form-group">
                <label>Product Images & Color Variants *</label>
                
                {/* Image Upload Button */}
                <div className="admin-image-upload-section">
                  <label className="admin-upload-btn">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleImageUpload}
                      style={{display:'none'}}
                    />
                    <span style={{color:'var(--bg)'}}>📁 {uploadingImages ? 'Uploading...' : 'Upload Images'}</span>
                  </label>
                  <small style={{fontSize:'11px',color:'var(--text)',marginLeft:'12px'}}>
                    Upload images for different color variants
                  </small>
                </div>

                {/* Image Preview Grid with Color Inputs */}
                {editingProduct.images && editingProduct.images.length > 0 && (
                  <div className="admin-image-preview-grid">
                    {editingProduct.images.map((img, index) => {
                      // Get variant - handle both string and object formats
                      const variantData = (editingProduct.colorVariants || [])[index];
                      const colorString = typeof variantData === 'string' ? variantData : (variantData?.color || '');
                      const colorHex = getColorHex(colorString);
                      
                      return (
                        <div key={index} className="admin-image-preview-with-color">
                          <div className="admin-image-preview">
                            <img src={img} alt={`Product ${index + 1}`} />
                            <button 
                              type="button"
                              className="admin-image-remove"
                              onClick={() => removeImage(index)}
                              title="Remove image"
                            >
                              ×
                            </button>
                          </div>
                          <div style={{marginTop:'8px',display:'flex',gap:'8px',alignItems:'center'}}>
                            <select
                              className="admin-color-input"
                              value={colorString}
                              onChange={(e) => updateColorVariant(index, e.target.value)}
                              style={{flex:1,cursor:'pointer'}}
                            >
                              <option value="">Select Color...</option>
                              <optgroup label="Grayscale">
                                <option value="Black">Black</option>
                                <option value="Charcoal">Charcoal</option>
                                <option value="Dark Gray">Dark Gray</option>
                                <option value="Gray">Gray</option>
                                <option value="Light Gray">Light Gray</option>
                                <option value="Silver">Silver</option>
                                <option value="Off White">Off White</option>
                                <option value="Ivory">Ivory</option>
                                <option value="White">White</option>
                              </optgroup>
                              <optgroup label="Reds & Pinks">
                                <option value="Maroon">Maroon</option>
                                <option value="Burgundy">Burgundy</option>
                                <option value="Red">Red</option>
                                <option value="Crimson">Crimson</option>
                                <option value="Coral">Coral</option>
                                <option value="Salmon">Salmon</option>
                                <option value="Pink">Pink</option>
                                <option value="Hot Pink">Hot Pink</option>
                                <option value="Rose">Rose</option>
                              </optgroup>
                              <optgroup label="Oranges & Yellows">
                                <option value="Orange">Orange</option>
                                <option value="Peach">Peach</option>
                                <option value="Gold">Gold</option>
                                <option value="Yellow">Yellow</option>
                                <option value="Mustard">Mustard</option>
                                <option value="Cream">Cream</option>
                              </optgroup>
                              <optgroup label="Greens">
                                <option value="Olive">Olive</option>
                                <option value="Khaki">Khaki</option>
                                <option value="Lime">Lime</option>
                                <option value="Green">Green</option>
                                <option value="Forest Green">Forest Green</option>
                                <option value="Mint">Mint</option>
                                <option value="Teal">Teal</option>
                                <option value="Turquoise">Turquoise</option>
                                <option value="Cyan">Cyan</option>
                              </optgroup>
                              <optgroup label="Blues">
                                <option value="Navy">Navy</option>
                                <option value="Blue">Blue</option>
                                <option value="Royal Blue">Royal Blue</option>
                                <option value="Sky Blue">Sky Blue</option>
                                <option value="Light Blue">Light Blue</option>
                              </optgroup>
                              <optgroup label="Purples">
                                <option value="Indigo">Indigo</option>
                                <option value="Purple">Purple</option>
                                <option value="Violet">Violet</option>
                                <option value="Lavender">Lavender</option>
                                <option value="Magenta">Magenta</option>
                              </optgroup>
                              <optgroup label="Browns & Tans">
                                <option value="Brown">Brown</option>
                                <option value="Tan">Tan</option>
                                <option value="Beige">Beige</option>
                                <option value="Camel">Camel</option>
                                <option value="Sand">Sand</option>
                              </optgroup>
                            </select>
                            <div 
                              style={{
                                width:'40px',
                                height:'40px',
                                borderRadius:'6px',
                                background: colorHex,
                                border: colorHex === '#FFFFFF' || colorHex === '#FAF9F6' || colorHex === '#FFFFF0' ? '2px solid var(--border)' : '2px solid rgba(0,0,0,0.3)',
                                flexShrink:0,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                transition: 'all 0.2s ease'
                              }}
                              title={colorString || 'No color selected'}
                            />
                          </div>
                          <small style={{fontSize:'11px',color: colorString ? 'var(--accent)' : 'var(--text-secondary)',marginTop:'6px',display:'block',textAlign:'center',fontWeight: colorString ? '600' : '400'}}>
                            {colorString ? `✓ ${colorString}` : 'Select a color'}
                          </small>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <div style={{marginTop:'16px',padding:'16px',background:'var(--bg-tertiary)',border:'1px solid var(--border)',borderRadius:'8px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'12px'}}>
                    <span style={{fontSize:'20px'}}>🎨</span>
                    <strong style={{fontSize:'12px',letterSpacing:'1px',textTransform:'uppercase',color:'var(--accent)'}}>Color Variant System</strong>
                  </div>
                  <p style={{fontSize:'12px',color:'var(--text-secondary)',lineHeight:'1.6',marginBottom:'8px'}}>
                    Each image represents a different color variant of your product. Select the color from the dropdown for each image.
                  </p>
                  <p style={{fontSize:'11px',color:'var(--text-muted)',lineHeight:'1.5'}}>
                    <strong>Available colors:</strong> Black, White, Gray, Red, Blue, Navy, Green, Yellow, Orange, Purple, Pink, Brown, Beige, and 50+ more colors organized by category.
                  </p>
                </div>
              </div>

              <div className="admin-form-checkboxes">
                <label className="admin-checkbox">
                  <input 
                    type="checkbox" 
                    checked={editingProduct.inStock}
                    onChange={(e) => setEditingProduct({...editingProduct, inStock: e.target.checked})}
                    disabled={true}
                  />
                  <span>In Stock (Auto: {(editingProduct.quantity || 0) > 0 ? 'Yes' : 'No'})</span>
                </label>
                <label className="admin-checkbox">
                  <input 
                    type="checkbox" 
                    checked={editingProduct.featured}
                    onChange={(e) => setEditingProduct({...editingProduct, featured: e.target.checked})}
                  />
                  <span>Featured</span>
                </label>
                <label className="admin-checkbox">
                  <input 
                    type="checkbox" 
                    checked={editingProduct.isNewDrop}
                    onChange={(e) => setEditingProduct({...editingProduct, isNewDrop: e.target.checked})}
                  />
                  <span>New Drop</span>
                </label>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn-secondary" onClick={() => setShowProductModal(false)}>Cancel</button>
              <button className="admin-btn-primary" onClick={handleSaveProduct}>
                {isAddingNew ? 'Add Product' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blog Post Edit/Add Modal */}
      {showBlogModal && editingBlogPost && (
        <div className="modal-overlay" onClick={() => setShowBlogModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{isAddingNewBlog ? 'ADD NEW BLOG POST' : 'EDIT BLOG POST'}</h2>
              <button className="modal-close" onClick={() => setShowBlogModal(false)}>&times;</button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Post Title *</label>
                  <input 
                    type="text" 
                    value={editingBlogPost.title}
                    onChange={(e) => setEditingBlogPost({...editingBlogPost, title: e.target.value})}
                    placeholder="THE ORIGIN — Against All Odds"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Slug (URL) *</label>
                  <input 
                    type="text" 
                    value={editingBlogPost.slug}
                    onChange={(e) => setEditingBlogPost({...editingBlogPost, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                    placeholder="the-origin"
                    disabled={!isAddingNewBlog}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Author</label>
                  <input 
                    type="text" 
                    value={editingBlogPost.author}
                    onChange={(e) => setEditingBlogPost({...editingBlogPost, author: e.target.value})}
                    placeholder="6six9ine"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Cover Image</label>
                <div className="admin-image-upload-section">
                  <label className="admin-upload-btn">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleBlogImageUpload}
                      style={{display:'none'}}
                    />
                    <span style={{color:'var(--bg)'}}>📁 Upload Cover Image</span>
                  </label>
                  {editingBlogPost.coverImage && (
                    <button 
                      className="admin-btn-small admin-btn-danger"
                      onClick={() => setEditingBlogPost({...editingBlogPost, coverImage: ''})}
                      style={{marginLeft:'12px'}}
                    >
                      Remove Image
                    </button>
                  )}
                </div>
                {editingBlogPost.coverImage && (
                  <div style={{marginTop:'12px',maxWidth:'400px'}}>
                    <img src={editingBlogPost.coverImage} alt="Cover" style={{width:'100%',height:'auto',border:'1px solid var(--border)'}} />
                  </div>
                )}
              </div>
              
              <div className="admin-form-group">
                <label>Excerpt *</label>
                <textarea 
                  rows="2"
                  value={editingBlogPost.excerpt}
                  onChange={(e) => setEditingBlogPost({...editingBlogPost, excerpt: e.target.value})}
                  placeholder="Short description for blog listing..."
                />
              </div>

              <div className="admin-form-group">
                <label>Full Content *</label>
                <textarea 
                  rows="10"
                  value={editingBlogPost.content}
                  onChange={(e) => setEditingBlogPost({...editingBlogPost, content: e.target.value})}
                  placeholder="Write your full blog post content here..."
                />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn-secondary" onClick={() => setShowBlogModal(false)}>Cancel</button>
              <button className="admin-btn-primary" onClick={handleSaveBlogPost}>
                {isAddingNewBlog ? 'Add Blog Post' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Story Section Edit/Add Modal */}
      {showStorySectionModal && editingStorySection && (
        <div className="modal-overlay" onClick={() => setShowStorySectionModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{isAddingNewSection ? 'ADD NEW SECTION' : 'EDIT SECTION'}</h2>
              <button className="modal-close" onClick={() => setShowStorySectionModal(false)}>&times;</button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>Section Title *</label>
                <input 
                  type="text" 
                  value={editingStorySection.title}
                  onChange={(e) => setEditingStorySection({...editingStorySection, title: e.target.value})}
                  placeholder="THE BEGINNING"
                />
              </div>

              <div className="admin-form-group">
                <label>Section Content *</label>
                <textarea 
                  rows="8"
                  value={editingStorySection.content}
                  onChange={(e) => setEditingStorySection({...editingStorySection, content: e.target.value})}
                  placeholder="Write your story content here..."
                />
              </div>

              <div className="admin-form-group">
                <label>Section Image</label>
                <div className="admin-image-upload-section">
                  <label className="admin-upload-btn">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleStorySectionImageUpload}
                      style={{display:'none'}}
                    />
                    <span style={{color:'var(--bg)'}}>📁 Upload Image</span>
                  </label>
                  {editingStorySection.image && (
                    <button 
                      className="admin-btn-small admin-btn-danger"
                      onClick={() => setEditingStorySection({...editingStorySection, image: ''})}
                      style={{marginLeft:'12px'}}
                    >
                      Remove Image
                    </button>
                  )}
                </div>
                {editingStorySection.image && (
                  <div style={{marginTop:'12px',maxWidth:'400px'}}>
                    <img src={editingStorySection.image} alt="Section" style={{width:'100%',height:'auto',border:'1px solid var(--border)'}} />
                  </div>
                )}
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn-secondary" onClick={() => setShowStorySectionModal(false)}>Cancel</button>
              <button className="admin-btn-primary" onClick={handleSaveStorySection}>
                {isAddingNewSection ? 'Add Section' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order View/Update Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>ORDER DETAILS - {selectedOrder.id}</h2>
              <button className="modal-close" onClick={() => setShowOrderModal(false)}>&times;</button>
            </div>
            <div className="admin-modal-body">
              {/* Customer Information */}
              <div className="profile-card" style={{marginBottom:'24px'}}>
                <h3 className="profile-card-title">CUSTOMER INFORMATION</h3>
                <div style={{display:'grid',gap:'12px',fontSize:'14px'}}>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <span style={{color:'var(--text-secondary)',fontWeight:'600'}}>Name:</span>
                    <span style={{color:'var(--text)'}}>{selectedOrder.customer}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <span style={{color:'var(--text-secondary)',fontWeight:'600'}}>Phone:</span>
                    <span style={{color:'var(--text)'}}>{selectedOrder.phone}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <span style={{color:'var(--text-secondary)',fontWeight:'600'}}>Address:</span>
                    <span style={{color:'var(--text)',textAlign:'right',maxWidth:'60%'}}>{selectedOrder.address}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <span style={{color:'var(--text-secondary)',fontWeight:'600'}}>Order Date:</span>
                    <span style={{color:'var(--text)'}}>{selectedOrder.date}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="profile-card" style={{marginBottom:'24px'}}>
                <h3 className="profile-card-title">PAYMENT METHOD</h3>
                <div style={{
                  display:'flex',
                  alignItems:'center',
                  gap:'16px',
                  padding:'16px 20px',
                  background:'var(--bg-tertiary)',
                  border:'2px solid',
                  borderColor: getPaymentMethodDisplay(selectedOrder.paymentMethod).color,
                  borderRadius:'8px'
                }}>
                  <span style={{fontSize:'32px'}}>{getPaymentMethodDisplay(selectedOrder.paymentMethod).icon}</span>
                  <div style={{flex:1}}>
                    <div style={{
                      fontSize:'16px',
                      fontWeight:'700',
                      color: getPaymentMethodDisplay(selectedOrder.paymentMethod).color,
                      marginBottom:'4px',
                      letterSpacing:'1px'
                    }}>
                      {getPaymentMethodDisplay(selectedOrder.paymentMethod).name}
                    </div>
                    {selectedOrder.paymentMethod === 'gcash' && (
                      <div style={{fontSize:'13px',color:'var(--text-secondary)'}}>
                        Payment sent to: {profileData.gcashNumber || '0912 345 6789'}
                      </div>
                    )}
                    {selectedOrder.paymentMethod === 'bank' && (
                      <div style={{fontSize:'13px',color:'var(--text-secondary)'}}>
                        Bank: {profileData.bankName || 'BDO'} - {profileData.bankAccountNumber || '1234567890'}
                      </div>
                    )}
                    {selectedOrder.paymentMethod === 'cod' && (
                      <div style={{fontSize:'13px',color:'var(--text-secondary)'}}>
                        Customer will pay upon delivery
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Proof of Payment */}
              {selectedOrder.proofOfPayment && selectedOrder.paymentMethod !== 'cod' && (
                <div className="profile-card" style={{marginBottom:'24px'}}>
                  <h3 className="profile-card-title">📸 PROOF OF PAYMENT</h3>
                  <div style={{
                    padding:'20px',
                    background:'var(--bg-tertiary)',
                    borderRadius:'8px',
                    border:'2px solid var(--border)'
                  }}>
                    <img 
                      src={selectedOrder.proofOfPayment} 
                      alt="Proof of Payment"
                      style={{
                        width:'100%',
                        maxWidth:'500px',
                        height:'auto',
                        borderRadius:'8px',
                        border:'2px solid var(--accent)',
                        cursor:'pointer'
                      }}
                      onClick={() => window.open(selectedOrder.proofOfPayment, '_blank')}
                    />
                    <p style={{
                      fontSize:'11px',
                      color:'var(--text-secondary)',
                      marginTop:'12px',
                      textAlign:'center'
                    }}>
                      Click image to view full size
                    </p>
                  </div>
                  
                  {/* Payment Verification Buttons */}
                  {selectedOrder.paymentStatus === 'pending_verification' && (
                    <div style={{
                      marginTop:'16px',
                      display:'flex',
                      gap:'12px'
                    }}>
                      <button
                        onClick={async () => {
                          try {
                            const orderDocId = selectedOrder.id; // Firebase document ID
                            
                            console.log('✅ Approving payment for order:', selectedOrder.orderId);
                            console.log('📋 Order document ID:', orderDocId);
                            
                            if (!orderDocId) {
                              throw new Error('Order ID is missing. Cannot approve payment.');
                            }
                            
                            const response = await fetch(`/api/orders/${orderDocId}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ 
                                paymentStatus: 'verified', 
                                status: 'processing' 
                              })
                            });
                            
                            console.log('📡 Response status:', response.status);
                            console.log('📡 Response ok:', response.ok);
                            
                            if (response.ok) {
                              const result = await response.json();
                              console.log('✅ Server response:', result);
                              
                              const updatedOrder = { ...selectedOrder, paymentStatus: 'verified', status: 'processing' };
                              setOrders(orders.map(o => 
                                o.id === orderDocId ? updatedOrder : o
                              ));
                              setSelectedOrder(updatedOrder);
                              showNotification('Payment verified successfully!', 'success');
                              console.log('💾 Payment approved in Firebase');
                              
                              // Send payment approved email to customer
                              console.log('📧 Sending payment approved email...');
                              console.log('📧 Customer email:', updatedOrder.email);
                              console.log('📧 Order ID:', updatedOrder.orderId);
                              
                              try {
                                const emailResponse = await fetch('/api/send-email', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    type: 'payment-approved',
                                    order: updatedOrder
                                  })
                                });
                                
                                console.log('📧 Email API response status:', emailResponse.status);
                                
                                if (emailResponse.ok) {
                                  const emailResult = await emailResponse.json();
                                  console.log('✅ Payment approved email sent successfully!');
                                  console.log('✅ Email result:', emailResult);
                                } else {
                                  const emailError = await emailResponse.json().catch(() => ({ error: 'Unknown error' }));
                                  console.error('❌ Failed to send payment approved email');
                                  console.error('❌ Email API error:', emailError);
                                  console.error('❌ Status:', emailResponse.status);
                                  
                                  // Show error to admin
                                  setAlertModal({ 
                                    message: `Payment approved but email failed: ${emailError.error || 'Unknown error'}. Please contact customer manually.`, 
                                    type: 'warning' 
                                  });
                                }
                              } catch (emailError) {
                                console.error('❌ Email sending exception:', emailError);
                                console.error('❌ Error message:', emailError.message);
                                console.error('❌ Error stack:', emailError.stack);
                                
                                // Show error to admin
                                setAlertModal({ 
                                  message: `Payment approved but email failed: ${emailError.message}. Please contact customer manually.`, 
                                  type: 'warning' 
                                });
                              }
                            } else {
                              const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                              console.error('❌ Server error:', errorData);
                              throw new Error(errorData.error || errorData.details || 'Failed to approve payment');
                            }
                          } catch (error) {
                            console.error('❌ Error approving payment:', error);
                            console.error('❌ Error message:', error.message);
                            console.error('❌ Error stack:', error.stack);
                            setAlertModal({ message: `Failed to approve payment: ${error.message}`, type: 'error' });
                          }
                        }}
                        style={{
                          flex:1,
                          padding:'12px 24px',
                          background:'var(--success)',
                          color:'white',
                          border:'none',
                          borderRadius:'8px',
                          fontSize:'14px',
                          fontWeight:'700',
                          letterSpacing:'1px',
                          cursor:'pointer',
                          transition:'all var(--transition)'
                        }}
                      >
                        ✓ APPROVE PAYMENT
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            const orderDocId = selectedOrder.id; // Firebase document ID
                            
                            console.log('🚫 Rejecting payment for order:', selectedOrder.orderId);
                            console.log('📋 Order document ID:', orderDocId);
                            
                            if (!orderDocId) {
                              throw new Error('Order ID is missing. Cannot reject payment.');
                            }
                            
                            const response = await fetch(`/api/orders/${orderDocId}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ 
                                paymentStatus: 'rejected', 
                                status: 'cancelled' 
                              })
                            });
                            
                            console.log('📡 Response status:', response.status);
                            console.log('📡 Response ok:', response.ok);
                            
                            if (response.ok) {
                              const result = await response.json();
                              console.log('✅ Server response:', result);
                              
                              const updatedOrder = { ...selectedOrder, paymentStatus: 'rejected', status: 'cancelled' };
                              setOrders(orders.map(o => 
                                o.id === orderDocId ? updatedOrder : o
                              ));
                              setSelectedOrder(updatedOrder);
                              
                              // IMPORTANT: Restore stock for all items in the rejected order
                              console.log('📈 Restoring stock for rejected order items...');
                              if (selectedOrder.items && selectedOrder.items.length > 0) {
                                for (const item of selectedOrder.items) {
                                  // Find product and restore stock
                                  const currentProducts = products;
                                  const updatedProducts = currentProducts.map(p => {
                                    if (p.slug === item.slug) {
                                      const newQuantity = (p.quantity || 0) + item.quantity;
                                      console.log(`  - ${p.name}: +${item.quantity} (${p.quantity} → ${newQuantity})`);
                                      return { ...p, quantity: newQuantity, inStock: newQuantity > 0 };
                                    }
                                    return p;
                                  });
                                  setAllProducts(updatedProducts);
                                }
                                console.log('✅ Stock restored successfully');
                              }
                              
                              showNotification('Payment rejected and stock restored', 'error');
                              console.log('💾 Payment rejected in Firebase');
                              
                              // Send payment rejected email to customer
                              console.log('📧 Sending payment rejected email...');
                              console.log('📧 Customer email:', updatedOrder.email);
                              console.log('📧 Order ID:', updatedOrder.orderId);
                              
                              try {
                                const emailResponse = await fetch('/api/send-email', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    type: 'payment-rejected',
                                    order: updatedOrder
                                  })
                                });
                                
                                console.log('📧 Email API response status:', emailResponse.status);
                                
                                if (emailResponse.ok) {
                                  const emailResult = await emailResponse.json();
                                  console.log('✅ Payment rejected email sent successfully!');
                                  console.log('✅ Email result:', emailResult);
                                } else {
                                  const emailError = await emailResponse.json().catch(() => ({ error: 'Unknown error' }));
                                  console.error('❌ Failed to send payment rejected email');
                                  console.error('❌ Email API error:', emailError);
                                  console.error('❌ Status:', emailResponse.status);
                                  
                                  // Show error to admin
                                  setAlertModal({ 
                                    message: `Payment rejected but email failed: ${emailError.error || 'Unknown error'}. Please contact customer manually.`, 
                                    type: 'warning' 
                                  });
                                }
                              } catch (emailError) {
                                console.error('❌ Email sending exception:', emailError);
                                console.error('❌ Error message:', emailError.message);
                                console.error('❌ Error stack:', emailError.stack);
                                
                                // Show error to admin
                                setAlertModal({ 
                                  message: `Payment rejected but email failed: ${emailError.message}. Please contact customer manually.`, 
                                  type: 'warning' 
                                });
                              }
                            } else {
                              const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                              console.error('❌ Server error:', errorData);
                              throw new Error(errorData.error || errorData.details || 'Failed to reject payment');
                            }
                          } catch (error) {
                            console.error('❌ Error rejecting payment:', error);
                            console.error('❌ Error message:', error.message);
                            console.error('❌ Error stack:', error.stack);
                            setAlertModal({ message: `Failed to reject payment: ${error.message}`, type: 'error' });
                          }
                        }}
                        style={{
                          flex:1,
                          padding:'12px 24px',
                          background:'var(--danger)',
                          color:'white',
                          border:'none',
                          borderRadius:'8px',
                          fontSize:'14px',
                          fontWeight:'700',
                          letterSpacing:'1px',
                          cursor:'pointer',
                          transition:'all var(--transition)'
                        }}
                      >
                        ✗ REJECT PAYMENT
                      </button>
                    </div>
                  )}
                  
                  {/* Payment Status Badge */}
                  {selectedOrder.paymentStatus === 'verified' && (
                    <div style={{
                      marginTop:'16px',
                      padding:'12px 20px',
                      background:'linear-gradient(135deg, rgba(46, 204, 113, 0.2) 0%, rgba(46, 204, 113, 0.1) 100%)',
                      border:'2px solid var(--success)',
                      borderRadius:'8px',
                      textAlign:'center',
                      fontSize:'14px',
                      fontWeight:'700',
                      color:'var(--success)',
                      letterSpacing:'1px'
                    }}>
                      ✓ PAYMENT VERIFIED
                    </div>
                  )}
                  
                  {selectedOrder.paymentStatus === 'rejected' && (
                    <div style={{
                      marginTop:'16px',
                      padding:'12px 20px',
                      background:'linear-gradient(135deg, rgba(231, 76, 60, 0.2) 0%, rgba(231, 76, 60, 0.1) 100%)',
                      border:'2px solid var(--danger)',
                      borderRadius:'8px',
                      textAlign:'center',
                      fontSize:'14px',
                      fontWeight:'700',
                      color:'var(--danger)',
                      letterSpacing:'1px'
                    }}>
                      ✗ PAYMENT REJECTED
                    </div>
                  )}
                </div>
              )}

              {/* Order Items */}
              <div className="profile-card" style={{marginBottom:'24px'}}>
                <h3 className="profile-card-title">ORDER ITEMS</h3>
                <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} style={{
                      display:'flex',
                      justifyContent:'space-between',
                      alignItems:'center',
                      padding:'12px',
                      background:'var(--bg-tertiary)',
                      borderRadius:'8px',
                      border:'1px solid var(--border)'
                    }}>
                      <div>
                        <div style={{fontWeight:'600',fontSize:'14px',marginBottom:'4px'}}>{item.name}</div>
                        <div style={{fontSize:'12px',color:'var(--text-secondary)'}}>
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span> • Color: {item.color}</span>}
                          <span> • Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div style={{fontWeight:'600',fontSize:'14px'}}>
                        ₱{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{
                  marginTop:'16px',
                  paddingTop:'16px',
                  borderTop:'2px solid var(--border)',
                  display:'flex',
                  justifyContent:'space-between',
                  alignItems:'center'
                }}>
                  <span style={{fontSize:'16px',fontWeight:'700',letterSpacing:'1px'}}>TOTAL:</span>
                  <span style={{fontSize:'20px',fontWeight:'700',color:'var(--accent)'}}>₱{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Order Status */}
              <div className="profile-card">
                <h3 className="profile-card-title">ORDER STATUS</h3>
                <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
                  {['pending', 'processing', 'completed', 'cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => {
                        handleUpdateOrderStatus(selectedOrder.id, status);
                        setSelectedOrder({...selectedOrder, status});
                      }}
                      style={{
                        flex:'1',
                        minWidth:'120px',
                        padding:'12px 20px',
                        background: selectedOrder.status === status ? 
                          (status === 'completed' ? 'var(--success)' : 
                           status === 'processing' ? 'var(--accent)' : 
                           status === 'cancelled' ? 'var(--danger)' : 
                           'var(--text-secondary)') : 
                          'var(--bg-tertiary)',
                        color: selectedOrder.status === status ? 'white' : 'var(--text)',
                        border: selectedOrder.status === status ? 'none' : '1px solid var(--border)',
                        borderRadius:'8px',
                        fontSize:'12px',
                        fontWeight:'700',
                        letterSpacing:'1px',
                        textTransform:'uppercase',
                        cursor:'pointer',
                        transition:'all var(--transition)'
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn-primary" onClick={() => setShowOrderModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
