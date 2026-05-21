'use client';
import { useState, useMemo } from 'react';
import { useProducts } from '@/context/ProductContext';
import ProductCard from '@/components/ProductCard';

export default function ShopPage() {
  const { products } = useProducts();
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [inStock, setInStock] = useState(false);

  const filtered = useMemo(() => {
    let items = [...products];
    
    // Filter by category
    if (category === 'new-drops') items = items.filter(p => p.isNewDrop);
    else if (category !== 'all') items = items.filter(p => p.category === category);
    
    // Filter by stock availability if checkbox is checked
    if (inStock) items = items.filter(p => p.inStock);
    
    // Apply sorting
    if (sortBy === 'price-asc') items.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') items.sort((a, b) => b.price - a.price);
    else if (sortBy === 'newest') items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // ALWAYS prioritize in-stock products at the top
    items.sort((a, b) => {
      // If both have same stock status, keep current order
      if (a.inStock === b.inStock) return 0;
      // In-stock products come first
      return a.inStock ? -1 : 1;
    });
    
    return items;
  }, [products, category, sortBy, inStock]);

  const cats = [
    { slug: 'all', name: 'Shop All' },
    { slug: 'tops', name: 'Tops' },
    { slug: 'longsleeve', name: 'Longsleeve' },
    { slug: 'mask', name: 'Mask' },
    { slug: 'new-drops', name: 'New Drops' },
  ];

  return (
    <div className="section">
      <div className="container">
        <div className="shop-layout">
          <aside className="shop-sidebar">
            <div className="filter-group">
              <h3>SORT IT OUT!</h3>
              {cats.map(c => (
                <label key={c.slug} className={category === c.slug ? 'active' : ''} onClick={() => setCategory(c.slug)} style={{cursor:'pointer'}}>
                  {c.name}
                </label>
              ))}
            </div>
            <div className="filter-group">
              <h3>AVAILABILITY</h3>
              <label>
                <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
                In stock only
              </label>
            </div>
          </aside>
          <div>
            <div className="shop-header">
              <span className="shop-count">{filtered.length} PRODUCTS</span>
              <div className="shop-sort">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
            <div className="products-grid">
              {filtered.map(product => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
