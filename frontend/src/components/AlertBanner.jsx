import { X } from 'lucide-react';

export default function AlertBanner({ type = 'error', message, onClose }) {
  if (!message) return null;

  return (
    <div className={`alert ${type === 'success' ? 'alert-success' : 'alert-error'}`} role="alert">
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          className="btn btn-sm"
          style={{ background: 'transparent', padding: '0.15rem' }}
          onClick={onClose}
          aria-label="Dismiss message"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
