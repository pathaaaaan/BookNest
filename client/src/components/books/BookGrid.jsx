import BookCard from './BookCard';

export default function BookGrid({ books, loading, emptyMessage = 'No books found' }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="bg-surface rounded-2xl overflow-hidden border border-border/50">
              <div className="aspect-[2/3] skeleton" />
              <div className="p-4 space-y-2">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-6xl mb-4">📚</p>
        <p className="text-text-secondary text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {books.map((book, index) => (
        <div key={book.olKey || index} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
          <BookCard book={book} />
        </div>
      ))}
    </div>
  );
}
