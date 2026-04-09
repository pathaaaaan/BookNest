import StarRating from '../ui/StarRating';

export default function ReviewList({ reviews, averageRating, totalRatings }) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-4xl font-bold gradient-text">{averageRating || '—'}</p>
          <StarRating rating={Math.round(averageRating)} readonly size="sm" />
          <p className="text-text-muted text-xs mt-1">{totalRatings} review{totalRatings !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Reviews */}
      {reviews?.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-surface border border-border rounded-xl p-5 animate-fade-in">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {review.userId?.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {review.userId?.name || 'Anonymous'}
                    </p>
                    <p className="text-xs text-text-muted">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <StarRating rating={review.rating} readonly size="sm" />
              </div>
              {review.comment && (
                <p className="text-text-secondary text-sm leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-text-muted text-center py-8">No reviews yet. Be the first!</p>
      )}
    </div>
  );
}
