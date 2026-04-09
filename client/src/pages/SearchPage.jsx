import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Fuse from 'fuse.js';
import BookGrid from '../components/books/BookGrid';
import { searchBooks } from '../api/bookApi';
import { HiMagnifyingGlass, HiFunnel } from 'react-icons/hi2';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [authorFilter, setAuthorFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  // Fetch from API when activeQuery changes
  useEffect(() => {
    if (!activeQuery) {
      setBooks([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await searchBooks({ q: activeQuery, limit: 30 });
        setBooks(res.data.data?.books || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [activeQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setActiveQuery(query.trim());
      setSearchParams({ q: query.trim() });
    }
  };

  // Client-side fuzzy filtering using Fuse.js
  const filteredBooks = useMemo(() => {
    let result = books;

    // Filter by exact author match (if provided)
    if (authorFilter) {
      result = result.filter(b => 
        b.authors?.some(a => a.toLowerCase().includes(authorFilter.toLowerCase()))
      );
    }

    // Filter by subject
    if (subjectFilter) {
      result = result.filter(b => 
        b.subjects?.some(s => s.toLowerCase().includes(subjectFilter.toLowerCase()))
      );
    }

    return result;
  }, [books, authorFilter, subjectFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="bg-surface border border-border p-6 rounded-2xl mb-8 card-hover">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, author, or keyword..."
              className="w-full pl-12 pr-4 py-3 bg-bg-primary border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 gradient-primary text-white font-medium rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            Search
          </button>
        </form>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
          <div className="bg-surface border border-border rounded-2xl p-5 sticky top-24">
            <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <HiFunnel className="w-5 h-5 text-primary" />
              Filters
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2 block">
                  Author
                </label>
                <input
                  type="text"
                  value={authorFilter}
                  onChange={(e) => setAuthorFilter(e.target.value)}
                  placeholder="Filter by author..."
                  className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2 block">
                  Subject / Genre
                </label>
                <input
                  type="text"
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  placeholder="Filter by subject..."
                  className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {(authorFilter || subjectFilter) && (
                <button
                  onClick={() => { setAuthorFilter(''); setSubjectFilter(''); }}
                  className="w-full py-2 text-sm text-text-secondary hover:text-error transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-text-primary">
              {activeQuery ? `Results for "${activeQuery}"` : 'Discover Books'}
            </h2>
            <span className="text-text-muted text-sm">{filteredBooks.length} books</span>
          </div>

          {!activeQuery && !loading ? (
            <div className="text-center py-20 bg-surface border border-border rounded-2xl">
              <HiMagnifyingGlass className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-secondary">Enter a search term to find books</p>
            </div>
          ) : (
             <BookGrid 
               books={filteredBooks} 
               loading={loading} 
               emptyMessage="No matching books found. Try adjusting your search or filters." 
             />
          )}
        </div>
      </div>
    </div>
  );
}
