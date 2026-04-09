import BookCard from '../books/BookCard';
import { HiSparkles } from 'react-icons/hi2';

export default function RecommendedBooks({ books, loading }) {
  if (loading) {
    return (
      <section>
        <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
          <HiSparkles className="w-6 h-6 text-accent" />
          Recommended For You
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-40">
              <div className="bg-surface rounded-2xl overflow-hidden border border-border/50">
                <div className="aspect-[2/3] skeleton" />
                <div className="p-3 space-y-2">
                  <div className="skeleton h-3 w-3/4 rounded" />
                  <div className="skeleton h-2 w-1/2 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!books || books.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
        <HiSparkles className="w-6 h-6 text-accent" />
        Recommended For You
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin' }}>
        {books.map((book, index) => (
          <div key={book.olKey || index} className="flex-shrink-0 w-40 animate-fade-in" style={{ animationDelay: `${index * 80}ms` }}>
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </section>
  );
}
