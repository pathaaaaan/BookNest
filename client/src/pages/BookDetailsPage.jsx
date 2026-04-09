import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookById } from '../api/bookApi';
import { addToLibrary, getBookStatus, removeFromLibrary } from '../api/libraryApi';
import { useAuth } from '../context/AuthContext';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewList from '../components/reviews/ReviewList';
import { getBookReviews } from '../api/reviewApi';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { HiBookmark, HiCheckCircle, HiPlayCircle, HiClock, HiOutlineDocumentText } from 'react-icons/hi2';

const PLACEHOLDER_COVER = 'data:image/svg+xml;base64,' + btoa(`
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
  <rect fill="#1E1A2B" width="300" height="450"/>
  <text fill="#6B7280" font-family="system-ui" font-size="60" text-anchor="middle" x="150" y="240">Book</text>
</svg>`);

export default function BookDetailsPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [libraryStatus, setLibraryStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  
  const [reviewsData, setReviewsData] = useState({ reviews: [], averageRating: 0, totalRatings: 0 });

  useEffect(() => {
    fetchBookInfo();
  }, [id]);

  const fetchBookInfo = async () => {
    setLoading(true);
    setError('');
    try {
      // Parallel fetches
      const [bookRes, reviewsRes] = await Promise.all([
        getBookById(id),
        getBookReviews(id).catch(() => ({ data: { data: { reviews: [], averageRating: 0, totalRatings: 0 } } }))
      ]);

      setBook(bookRes.data.data);
      setReviewsData(reviewsRes.data.data);

      if (isAuthenticated) {
        const statusRes = await getBookStatus(id);
        setLibraryStatus(statusRes.data.data?.status || null);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load book details. It might not exist in the Open Library database.');
    } finally {
      setLoading(false);
    }
  };

  const handleLibraryAction = async (status) => {
    if (!isAuthenticated) return;
    setStatusLoading(true);
    try {
      if (status === 'remove') {
        await removeFromLibrary(id);
        setLibraryStatus(null);
      } else {
        await addToLibrary({
          bookId: id,
          bookTitle: book.title,
          coverUrl: book.coverUrl,
          authors: book.authors,
          subjects: book.subjects,
          status,
        });
        setLibraryStatus(status);
      }
    } catch (err) {
      console.error('Library action failed:', err);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleReviewAdded = (newReview) => {
    // Optimistic UI update for reviews
    setReviewsData(prev => {
      const existing = prev.reviews.filter(r => r.userId._id !== newReview.userId._id);
      const updatedReviews = [newReview, ...existing];
      const newTotal = updatedReviews.length;
      const newAvg = updatedReviews.reduce((acc, r) => acc + r.rating, 0) / newTotal;
      
      return {
        reviews: updatedReviews,
        totalRatings: newTotal,
        averageRating: Math.round(newAvg * 10) / 10
      };
    });
  };

  if (loading) return <div className="py-32"><LoadingSpinner size="lg" text="Loading book details..." /></div>;
  if (error) return <div className="py-20"><ErrorMessage message={error} onRetry={fetchBookInfo} /></div>;
  if (!book) return null;

  const hasEpub = book.iaIdentifiers && book.iaIdentifiers.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Left Column: Cover & Actions */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          <div className="bg-surface rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/10 mb-6">
            <img
              src={book.coverUrl || PLACEHOLDER_COVER}
              alt={book.title}
              className="w-full h-auto aspect-[2/3] object-cover"
              onError={(e) => { e.target.src = PLACEHOLDER_COVER; }}
            />
          </div>

          <div className="space-y-3">
            {/* Read Button */}
            {hasEpub ? (
              <Link
                to={`/reader/${id}`}
                className="w-full py-3.5 gradient-primary text-white font-medium rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                <HiPlayCircle className="w-5 h-5" />
                Read EPUB
              </Link>
            ) : (
              <div className="w-full py-3 bg-surface border border-border text-text-muted font-medium rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                <HiOutlineDocumentText className="w-5 h-5" />
                No EPUB Available
              </div>
            )}

            {/* Library Actions */}
            {isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2">
                {libraryStatus === 'reading' ? (
                  <button onClick={() => handleLibraryAction('remove')} disabled={statusLoading} className="py-2.5 bg-primary/20 text-primary border border-primary/30 rounded-xl text-sm font-medium hover:bg-error/10 hover:text-error hover:border-error/30 transition-colors">
                    Reading
                  </button>
                ) : (
                  <button onClick={() => handleLibraryAction('reading')} disabled={statusLoading} className="py-2.5 bg-surface border border-border text-text-primary rounded-xl text-sm font-medium hover:bg-surface-hover transition-colors">
                    Start Reading
                  </button>
                )}

                {libraryStatus === 'completed' ? (
                  <button onClick={() => handleLibraryAction('remove')} disabled={statusLoading} className="py-2.5 bg-success/20 text-success border border-success/30 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-error/10 hover:text-error hover:border-error/30 transition-colors">
                    <HiCheckCircle className="w-4 h-4" /> Done
                  </button>
                ) : (
                  <button onClick={() => handleLibraryAction('completed')} disabled={statusLoading} className="py-2.5 bg-surface border border-border text-text-primary rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-surface-hover transition-colors">
                    Mark Done
                  </button>
                )}

                {libraryStatus === 'wishlist' ? (
                  <button onClick={() => handleLibraryAction('remove')} disabled={statusLoading} className="col-span-2 py-2.5 bg-accent/20 text-accent border border-accent/30 rounded-xl text-sm font-medium hover:bg-error/10 hover:text-error hover:border-error/30 transition-colors">
                    Saved to Wishlist
                  </button>
                ) : (
                   libraryStatus !== 'reading' && libraryStatus !== 'completed' && (
                    <button onClick={() => handleLibraryAction('wishlist')} disabled={statusLoading} className="col-span-2 py-2.5 bg-surface border border-border text-text-primary rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-surface-hover transition-colors">
                      <HiBookmark className="w-4 h-4" /> Save for Later
                    </button>
                   )
                )}
              </div>
            ) : (
              <Link to="/login" className="w-full py-2.5 block text-center bg-surface border border-border text-text-secondary rounded-xl text-sm font-medium hover:bg-surface-hover transition-colors">
                Log in to save
              </Link>
            )}
          </div>
        </div>

        {/* Right Column: Details & Reviews */}
        <div className="flex-1 space-y-10">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-2">{book.title}</h1>
            <p className="text-xl text-primary font-medium mb-6">
              {book.authors?.join(', ') || 'Unknown Author'}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-text-secondary mb-8">
              {book.firstPublishYear && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface rounded-lg border border-border">
                  <HiClock className="w-4 h-4 text-text-muted" />
                  <span>First published: {book.firstPublishYear}</span>
                </div>
              )}
            </div>

            <div className="prose prose-invert max-w-none">
              <h3 className="text-lg font-semibold text-text-primary mb-2">Description</h3>
              <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                {book.description || 'No description available for this book.'}
              </p>
            </div>

            {book.subjects?.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-text-primary mb-3">Subjects & Genres:</h3>
                <div className="flex flex-wrap gap-2">
                  {book.subjects.slice(0, 15).map(sub => (
                    <span key={sub} className="px-3 py-1 bg-surface border border-border rounded-full text-xs text-text-secondary">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <hr className="border-border/50" />

          {/* Reviews Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-6">Reader Reviews</h2>
              <ReviewList 
                reviews={reviewsData.reviews} 
                averageRating={reviewsData.averageRating} 
                totalRatings={reviewsData.totalRatings} 
              />
            </div>
            <div>
              <div className="sticky top-24">
                <ReviewForm bookId={id} onReviewAdded={handleReviewAdded} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
