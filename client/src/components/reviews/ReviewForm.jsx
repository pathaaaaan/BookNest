import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../ui/StarRating';
import { createReview } from '../../api/reviewApi';

export default function ReviewForm({ bookId, onReviewAdded }) {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await createReview({ bookId, rating, comment });
      setRating(0);
      setComment('');
      onReviewAdded?.(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 text-center">
        <p className="text-text-secondary">Please log in to write a review.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-2xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">Write a Review</h3>
      
      <div>
        <label className="text-sm text-text-secondary mb-2 block">Your Rating</label>
        <StarRating rating={rating} onRate={setRating} size="lg" />
      </div>

      <div>
        <label className="text-sm text-text-secondary mb-2 block">Your Review (optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this book..."
          rows={3}
          maxLength={1000}
          className="w-full px-4 py-3 bg-bg-primary border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 resize-none transition-all"
        />
      </div>

      {error && <p className="text-error text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="px-6 py-2.5 gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
