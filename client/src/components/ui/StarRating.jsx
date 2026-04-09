import { useState } from 'react';
import { HiStar } from 'react-icons/hi2';

export default function StarRating({ rating = 0, onRate, size = 'md', readonly = false }) {
  const [hover, setHover] = useState(0);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer'} transition-transform ${
            !readonly && 'hover:scale-110'
          }`}
          onClick={() => !readonly && onRate?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          <HiStar
            className={`${sizes[size]} transition-colors ${
              (hover || rating) >= star ? 'text-accent' : 'text-text-muted/30'
            }`}
          />
        </button>
      ))}
      {rating > 0 && !readonly && (
        <span className="text-text-secondary text-sm ml-1.5">{rating}/5</span>
      )}
    </div>
  );
}
