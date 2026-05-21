'use client';
import { useEffect } from 'react';

export default function AlertModal({ message, onClose, type = 'info' }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const getIcon = () => {
    switch(type) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'warning': return '⚠';
      default: return 'ℹ';
    }
  };

  const getColor = () => {
    switch(type) {
      case 'success': return 'var(--success)';
      case 'error': return 'var(--danger)';
      case 'warning': return 'var(--accent)';
      default: return 'var(--text)';
    }
  };

  return (
    <div className="alert-overlay" onClick={onClose}>
      <div className="alert-modal" onClick={(e) => e.stopPropagation()}>
        <div className="alert-icon" style={{background: getColor()}}>
          {getIcon()}
        </div>
        <div className="alert-message">{message}</div>
        <button className="alert-btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}
