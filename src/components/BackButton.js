'use client';
import { useRouter, usePathname } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show on homepage or admin page
  if (pathname === '/' || pathname.startsWith('/admin')) return null;

  return (
    <button 
      onClick={() => router.back()} 
      className="back-button"
      aria-label="Go back"
    >
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
    </button>
  );
}
