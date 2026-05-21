'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { sampleBlogPosts } from '@/data/seed';

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState(null);

  // Load blog post from Firebase API
  useEffect(() => {
    const loadBlogPost = async () => {
      try {
        const response = await fetch('/api/blog');
        if (response.ok) {
          const posts = await response.json();
          const foundPost = posts.find(p => p.slug === params.slug);
          setPost(foundPost || null);
          console.log('🚀 Blog post loaded from Firebase');
        }
      } catch (error) {
        console.error('Failed to load blog post:', error);
        // Fallback to sample data
        const foundPost = sampleBlogPosts.find(p => p.slug === params.slug);
        setPost(foundPost || null);
      }
    };
    
    loadBlogPost();
  }, [params.slug]);

  if (!post) {
    return (
      <div className="section" style={{textAlign:'center',minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div>
          <h2 style={{fontFamily:'Bebas Neue',fontSize:'36px',letterSpacing:'2px',marginBottom:'16px'}}>POST NOT FOUND</h2>
          <Link href="/blog" className="hero-cta" style={{display:'inline-flex'}}>BACK TO BLOG</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container" style={{maxWidth:'720px'}}>
        <div style={{marginBottom:'32px'}}>
          <Link href="/blog" style={{fontSize:'13px',color:'var(--text-muted)',letterSpacing:'1px'}}>← BACK TO BLOG</Link>
        </div>
        <h1 style={{fontFamily:'Bebas Neue',fontSize:'clamp(28px,5vw,48px)',letterSpacing:'3px',marginBottom:'12px'}}>{post.title}</h1>
        <p style={{color:'var(--text-muted)',fontSize:'13px',marginBottom:'32px'}}>{post.author} · {new Date(post.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</p>
        {post.coverImage && (
          <div className="blog-card-img" style={{aspectRatio:'16/9',marginBottom:'32px',overflow:'hidden'}}>
            <img 
              src={post.coverImage} 
              alt={post.title}
              style={{width:'100%',height:'100%',objectFit:'cover'}}
            />
          </div>
        )}
        <div style={{color:'var(--text-secondary)',lineHeight:'1.9',fontSize:'16px',whiteSpace:'pre-wrap'}}>{post.content}</div>
      </div>
    </div>
  );
}
