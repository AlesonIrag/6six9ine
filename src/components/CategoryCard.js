'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CategoryCard({ name, href, images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2000); // Change image every 2 seconds

    return () => clearInterval(interval);
  }, [images]);

  return (
    <Link href={href} className="category-card">
      {images && images.length > 0 ? (
        <div className="category-card-slideshow">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={name}
              className={`category-card-image ${idx === currentIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      ) : (
        <div className="category-card-placeholder">{name}</div>
      )}
      <h3>{name}</h3>
    </Link>
  );
}
