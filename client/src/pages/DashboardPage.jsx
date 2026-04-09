import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLibrary } from '../api/libraryApi';
import { getRecommendations } from '../api/recommendationApi';
import { getAllProgress } from '../api/readingApi';
import ContinueReading from '../components/dashboard/ContinueReading';
import SavedBooks from '../components/dashboard/SavedBooks';
import RecommendedBooks from '../components/dashboard/RecommendedBooks';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { HiCheckBadge, HiBookmark } from 'react-icons/hi2';

export default function DashboardPage() {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [progressRes, wishlistRes, completedRes] = await Promise.all([
          getAllProgress(),
          getLibrary({ status: 'wishlist' }),
          getLibrary({ status: 'completed' })
        ]);

        setProgressData(progressRes.data.data);
        setWishlist(wishlistRes.data.data);
        setCompleted(completedRes.data.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await getRecommendations({ limit: 10 });
        setRecommendations(res.data.data);
      } catch (err) {
        console.error('Failed to load recommendations', err);
      } finally {
        setRecLoading(false);
      }
    };
    fetchRecs();
  }, []);

  if (loading) {
    return <div className="py-32"><LoadingSpinner size="lg" text="Loading your dashboard..." /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-text-primary">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-text-secondary mt-1">Here's your reading universe at a glance.</p>
      </div>

      <div className="space-y-12">
        {progressData.length > 0 && (
           <ContinueReading progressList={progressData} />
        )}

        <RecommendedBooks books={recommendations} loading={recLoading} />

        {(wishlist.length > 0) && (
          <SavedBooks 
            title="Your Wishlist" 
            books={wishlist} 
            icon={HiBookmark}
          />
        )}

        {(completed.length > 0) && (
          <SavedBooks 
            title="Completed Books" 
            books={completed} 
            icon={HiCheckBadge}
          />
        )}

        {/* Empty State */}
        {progressData.length === 0 && wishlist.length === 0 && completed.length === 0 && (
          <div className="text-center py-20 bg-surface border border-border rounded-3xl">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Your library is empty</h3>
            <p className="text-text-secondary max-w-md mx-auto mb-6">
              Start exploring books and add them to your library to track your progress and get personalized recommendations.
            </p>
            <a href="/search" className="display-inline-block px-6 py-3 gradient-primary text-white font-medium rounded-xl hover:opacity-90 transition-opacity">
              Explore Books
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
