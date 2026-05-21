'use client';
import { useState, useEffect } from 'react';

export default function StoryPage() {
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

  // Load story content from Firebase API
  useEffect(() => {
    const loadStory = async () => {
      try {
        const response = await fetch('/api/story');
        if (response.ok) {
          const data = await response.json();
          setStoryContent(data);
          console.log('🚀 Story content loaded from Firebase');
        }
      } catch (error) {
        console.error('Failed to load story content:', error);
      }
    };
    
    loadStory();
  }, []);

  return (
    <>
      <section className="story-hero">
        <div className="hero-content">
          <h1 style={{fontFamily:'Bebas Neue',fontSize:'clamp(40px,7vw,80px)',letterSpacing:'6px',marginBottom:'16px'}}>
            {storyContent.title}
          </h1>
          <p style={{fontSize:'14px',letterSpacing:'4px',textTransform:'uppercase',color:'var(--text-secondary)'}}>
            {storyContent.subtitle}
          </p>
        </div>
      </section>

      <div className="container">
        {storyContent.sections.map((section, index) => (
          <section key={index} className={`story-section ${index % 2 === 1 ? 'reverse' : ''}`}>
            <div className="story-text">
              <h2>{section.title}</h2>
              <p>{section.content}</p>
            </div>
            <div className="story-img" style={{
              background: section.image ? 'transparent' : 'var(--bg-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {section.image ? (
                <img 
                  src={section.image} 
                  alt={section.title}
                  style={{width:'100%',height:'100%',objectFit:'cover'}}
                />
              ) : (
                <div style={{
                  fontSize:'48px',
                  opacity: 0.3,
                  textAlign: 'center'
                }}>
                  📷
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
