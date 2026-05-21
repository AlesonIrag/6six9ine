'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { sampleBlogPosts } from '@/data/seed';

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState(sampleBlogPosts);

  // Load blog posts from Firebase API
  useEffect(() => {
    const loadBlog = async () => {
      try {
        const response = await fetch('/api/blog');
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setBlogPosts(data);
            console.log('🚀 Blog posts loaded from Firebase');
          }
        }
      } catch (error) {
        console.error('Failed to load blog posts:', error);
      }
    };
    
    loadBlog();
  }, []);

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <h2>BLOG</h2>
          <p>Stories from the underground</p>
        </div>
        <div className="blog-grid">
          {blogPosts.map(post => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="blog-card">
              <div className="blog-card-img">
                {post.coverImage && (
                  <img 
                    src={post.coverImage} 
                    alt={post.title}
                    style={{width:'100%',height:'100%',objectFit:'cover'}}
                  />
                )}
              </div>
              <div className="blog-card-body">
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="blog-card-date">{new Date(post.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
