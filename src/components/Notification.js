'use client';
import { useEffect } from 'react';

export default function Notification({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification notification-${type}`}>
      <div className="notification-icon">
        {type === 'success' && '✓'}
        {type === 'error' && '✗'}
        {type === 'delete' && '🗑'}
      </div>
      <div className="notification-message">{message}</div>
      <button className="notification-close" onClick={onClose}>×</button>
    </div>
  );
}
