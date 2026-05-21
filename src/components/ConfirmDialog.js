'use client';

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">⚠️</div>
        <h3 className="confirm-title">Confirm Action</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="confirm-btn confirm-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-btn confirm-btn-delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
