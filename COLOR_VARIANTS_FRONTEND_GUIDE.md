# Color Variants - Frontend Display Guide

## How to Display Color Variants to Customers

This guide shows how to implement color variant selection on the product detail page and product cards.

---

## 1. Product Detail Page

### Display Color Selector

```javascript
// In product detail page component
const [selectedColor, setSelectedColor] = useState(0); // Index of selected color

// Get color variants from product
const colorVariants = product.colorVariants || [];
const currentImage = product.images[selectedColor];

// Render color selector
<div className="color-selector">
  <label className="color-label">
    Color: <strong>{colorVariants[selectedColor]?.color || 'Default'}</strong>
  </label>
  
  <div className="color-swatches">
    {colorVariants.map((variant, index) => {
      const colorHex = getColorHex(variant.color);
      const isSelected = selectedColor === index;
      
      return (
        <button
          key={index}
          className={`color-swatch ${isSelected ? 'active' : ''}`}
          onClick={() => setSelectedColor(index)}
          title={variant.color}
          style={{
            background: colorHex,
            border: isSelected 
              ? '3px solid var(--accent)' 
              : '2px solid var(--border)'
          }}
        />
      );
    })}
  </div>
</div>

// Display current color's image
<img src={currentImage} alt={product.name} />
```

### CSS Styles

```css
.color-selector {
  margin-bottom: 24px;
}

.color-label {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 12px;
  display: block;
}

.color-swatches {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  position: relative;
}

.color-swatch:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.color-swatch.active {
  transform: scale(1.15);
  box-shadow: 0 0 0 3px var(--accent);
}

.color-swatch.active::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-shadow: 0 0 3px rgba(0,0,0,0.5);
}
```

---

## 2. Product Card (Grid View)

### Show Available Colors Badge

```javascript
// In product card component
const colorCount = product.colorVariants?.length || 0;

{colorCount > 1 && (
  <div className="color-badge">
    {colorCount} Colors
  </div>
)}

// Or show color dots
{product.colorVariants && product.colorVariants.length > 0 && (
  <div className="color-dots">
    {product.colorVariants.slice(0, 4).map((variant, index) => (
      <span
        key={index}
        className="color-dot"
        style={{ background: getColorHex(variant.color) }}
        title={variant.color}
      />
    ))}
    {product.colorVariants.length > 4 && (
      <span className="color-more">+{product.colorVariants.length - 4}</span>
    )}
  </div>
)}
```

### CSS Styles

```css
.color-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 4px 10px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  border-radius: 12px;
  z-index: 2;
}

.color-dots {
  position: absolute;
  bottom: 12px;
  left: 12px;
  display: flex;
  gap: 6px;
  align-items: center;
  z-index: 2;
}

.color-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.color-more {
  font-size: 11px;
  font-weight: 700;
  color: white;
  background: rgba(0,0,0,0.8);
  padding: 2px 6px;
  border-radius: 10px;
}
```

---

## 3. Color Hover Preview (Advanced)

### Change Image on Color Hover

```javascript
const [hoveredColor, setHoveredColor] = useState(null);
const displayImage = hoveredColor !== null 
  ? product.images[hoveredColor] 
  : product.images[selectedColor];

<div className="color-swatches">
  {colorVariants.map((variant, index) => (
    <button
      key={index}
      className={`color-swatch ${selectedColor === index ? 'active' : ''}`}
      onClick={() => setSelectedColor(index)}
      onMouseEnter={() => setHoveredColor(index)}
      onMouseLeave={() => setHoveredColor(null)}
      title={variant.color}
      style={{ background: getColorHex(variant.color) }}
    />
  ))}
</div>

<img src={displayImage} alt={product.name} />
```

---

## 4. Color Filter (Shop Page)

### Filter Products by Color

```javascript
const [selectedColors, setSelectedColors] = useState([]);

// Get all unique colors from products
const allColors = [...new Set(
  products.flatMap(p => 
    (p.colorVariants || []).map(v => v.color)
  )
)].sort();

// Filter products
const filteredProducts = products.filter(product => {
  if (selectedColors.length === 0) return true;
  return product.colorVariants?.some(v => 
    selectedColors.includes(v.color)
  );
});

// Render color filter
<div className="filter-group">
  <h3>Colors</h3>
  {allColors.map(color => (
    <label key={color} className="filter-checkbox">
      <input
        type="checkbox"
        checked={selectedColors.includes(color)}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedColors([...selectedColors, color]);
          } else {
            setSelectedColors(selectedColors.filter(c => c !== color));
          }
        }}
      />
      <span 
        className="color-swatch-small"
        style={{ background: getColorHex(color) }}
      />
      <span>{color}</span>
    </label>
  ))}
</div>
```

---

## 5. Helper Functions

### Color Utilities (Copy to Frontend)

```javascript
// Color map (same as admin)
const colorMap = {
  'Black': '#000000',
  'White': '#FFFFFF',
  'Gray': '#808080',
  'Grey': '#808080',
  'Red': '#FF0000',
  'Blue': '#0000FF',
  'Navy': '#000080',
  'Green': '#008000',
  'Yellow': '#FFFF00',
  'Orange': '#FFA500',
  'Purple': '#800080',
  'Pink': '#FFC0CB',
  'Brown': '#8B4513',
  'Beige': '#F5F5DC',
  'Cream': '#FFFDD0',
  'Olive': '#808000',
  'Maroon': '#800000',
  'Teal': '#008080',
  'Cyan': '#00FFFF',
  'Magenta': '#FF00FF',
  'Lime': '#00FF00',
  'Indigo': '#4B0082',
  'Violet': '#EE82EE',
  'Gold': '#FFD700',
  'Silver': '#C0C0C0',
  'Khaki': '#F0E68C',
  'Tan': '#D2B48C',
  'Charcoal': '#36454F',
  'Burgundy': '#800020',
  'Mint': '#98FF98',
  'Coral': '#FF7F50',
  'Peach': '#FFE5B4',
  'Lavender': '#E6E6FA',
  'Turquoise': '#40E0D0',
  'Salmon': '#FA8072',
  'Sky Blue': '#87CEEB',
  'Forest Green': '#228B22',
  'Hot Pink': '#FF69B4',
  'Light Gray': '#D3D3D3',
  'Dark Gray': '#A9A9A9',
  'Off White': '#FAF9F6',
  'Ivory': '#FFFFF0',
};

// Get hex color from name
export const getColorHex = (colorName) => {
  if (!colorName) return '#CCCCCC';
  const normalized = colorName.trim();
  if (normalized.startsWith('#')) return normalized;
  const found = Object.keys(colorMap).find(
    key => key.toLowerCase() === normalized.toLowerCase()
  );
  return found ? colorMap[found] : '#CCCCCC';
};

// Check if color is light (for text contrast)
export const isLightColor = (hex) => {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 200;
};

// Get contrasting text color
export const getContrastColor = (hex) => {
  return isLightColor(hex) ? '#000000' : '#FFFFFF';
};
```

---

## 6. Complete Example Component

```javascript
'use client';
import { useState } from 'react';
import { getColorHex } from '@/lib/colorUtils';

export default function ProductDetail({ product }) {
  const [selectedColor, setSelectedColor] = useState(0);
  const colorVariants = product.colorVariants || [];
  const currentImage = product.images[selectedColor];
  const currentColor = colorVariants[selectedColor]?.color || 'Default';

  return (
    <div className="product-detail">
      {/* Product Image */}
      <div className="product-gallery">
        <img src={currentImage} alt={product.name} />
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="product-price">₱{product.price}</p>

        {/* Color Selector */}
        {colorVariants.length > 0 && (
          <div className="color-selector">
            <label className="color-label">
              Color: <strong>{currentColor}</strong>
            </label>
            
            <div className="color-swatches">
              {colorVariants.map((variant, index) => {
                const colorHex = getColorHex(variant.color);
                const isSelected = selectedColor === index;
                
                return (
                  <button
                    key={index}
                    className={`color-swatch ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedColor(index)}
                    title={variant.color}
                    style={{
                      background: colorHex,
                      border: isSelected 
                        ? '3px solid var(--accent)' 
                        : '2px solid var(--border)'
                    }}
                  >
                    {isSelected && <span className="check">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Size Selector */}
        <div className="size-selector">
          {/* ... size selection ... */}
        </div>

        {/* Add to Cart */}
        <button className="add-to-cart">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
```

---

## 7. Mobile Optimization

### Responsive Color Swatches

```css
@media (max-width: 768px) {
  .color-swatches {
    gap: 8px;
  }
  
  .color-swatch {
    width: 36px;
    height: 36px;
  }
  
  .color-label {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .color-swatches {
    gap: 6px;
  }
  
  .color-swatch {
    width: 32px;
    height: 32px;
  }
}
```

---

## 8. Accessibility

### ARIA Labels and Keyboard Navigation

```javascript
<button
  className="color-swatch"
  onClick={() => setSelectedColor(index)}
  aria-label={`Select ${variant.color} color`}
  aria-pressed={selectedColor === index}
  role="radio"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setSelectedColor(index);
    }
  }}
>
  {/* ... */}
</button>
```

---

## Implementation Checklist

- [ ] Copy `getColorHex()` function to frontend utils
- [ ] Add color selector to product detail page
- [ ] Update product card to show color count/dots
- [ ] Add color filter to shop page
- [ ] Style color swatches with CSS
- [ ] Test color selection functionality
- [ ] Add hover preview (optional)
- [ ] Implement mobile responsive styles
- [ ] Add accessibility features
- [ ] Test with real product data

---

## Tips

1. **Performance**: Memoize color hex calculations
2. **UX**: Show color name on hover
3. **Visual**: Add checkmark on selected color
4. **Mobile**: Make swatches touch-friendly (min 44x44px)
5. **Loading**: Show skeleton for color swatches
6. **Empty State**: Handle products without color variants gracefully

---

**Ready to implement?** Start with the product detail page color selector, then expand to other areas!
