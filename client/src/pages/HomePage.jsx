import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookGrid from '../components/books/BookGrid';
import { getTrendingBooks, searchBooks } from '../api/bookApi';
import { HiMagnifyingGlass, HiSparkles, HiBookOpen, HiUserGroup, HiGlobeAlt } from 'react-icons/hi2';

const CATEGORIES = ['Fiction', 'Science', 'History', 'Fantasy', 'Romance', 'Mystery', 'Philosophy', 'Biography'];

export default function HomePage() {
  const navigate = useNavigate();
  const [heroQuery, setHeroQuery] = useState('');
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [categoryBooks, setCategoryBooks] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Fiction');
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await getTrendingBooks({ subject: 'popular', limit: 10 });
        setTrendingBooks(res.data.data || []);
      } catch (err) {
        console.error('Trending fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      setCategoryLoading(true);
      try {
        const res = await searchBooks({ q: activeCategory, limit: 10 });
        setCategoryBooks(res.data.data?.books || []);
      } catch (err) {
        console.error('Category fetch error:', err);
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategory();
  }, [activeCategory]);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(heroQuery.trim())}`);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/8 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6 animate-fade-in">
              <HiSparkles className="w-4 h-4" />
              Discover your next favorite book
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-text-primary leading-tight mb-6 animate-slide-up">
              Your Personal
              <span className="gradient-text block mt-1">Reading Universe</span>
            </h1>

            <p className="text-text-secondary text-lg md:text-xl mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
              Search millions of books, read EPUBs in-browser, track your progress, 
              and get personalized recommendations — all in one place.
            </p>

            {/* Hero Search */}
            <form onSubmit={handleHeroSearch} className="animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="relative max-w-xl mx-auto">
                <HiMagnifyingGlass className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  placeholder="Search by title, author, or subject..."
                  className="w-full pl-14 pr-32 py-4 bg-surface border border-border rounded-2xl text-text-primary placeholder:text-text-muted text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 gradient-primary text-white font-medium rounded-xl hover:opacity-90 transition-opacity text-sm"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-12 animate-fade-in" style={{ animationDelay: '400ms' }}>
              {[
                { icon: HiBookOpen, label: 'Books', value: '20M+' },
                { icon: HiUserGroup, label: 'Authors', value: '6M+' },
                { icon: HiGlobeAlt, label: 'Languages', value: '100+' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center">
                  <Icon className="w-5 h-5 text-primary mx-auto mb-1.5" />
                  <p className="text-xl font-bold text-text-primary">{value}</p>
                  <p className="text-text-muted text-xs">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <HiSparkles className="w-4 h-4 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">Trending Now</h2>
        </div>
        <BookGrid books={trendingBooks} loading={loading} emptyMessage="Loading trending books..." />
      </section>

      {/* Browse by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Browse by Category</h2>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'gradient-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-primary/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <BookGrid books={categoryBooks} loading={categoryLoading} emptyMessage={`No ${activeCategory} books found`} />
      </section>
    </div>
  );
}
