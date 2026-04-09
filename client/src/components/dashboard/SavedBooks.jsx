import { Link } from 'react-router-dom';
import { HiBookmark, HiCheckCircle, HiXMark } from 'react-icons/hi2';

export default function SavedBooks({ books, title, icon: Icon = HiBookmark, onRemove }) {
  if (!books || books.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
        <Icon className="w-6 h-6 text-primary" />
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {books.map((item) => (
          <div key={item.bookId} className="relative group">
            <Link
              to={`/book/${item.bookId}`}
              className="block bg-surface rounded-2xl overflow-hidden border border-border/50 card-hover"
            >
              <div className="aspect-[2/3] overflow-hidden bg-bg-tertiary">
                {item.coverUrl ? (
                  <img
                    src={item.coverUrl}
                    alt={item.bookTitle}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">📚</div>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-text-primary font-medium text-xs leading-tight line-clamp-2">
                  {item.bookTitle}
                </h3>
                <p className="text-text-muted text-[11px] mt-1 line-clamp-1">
                  {item.authors?.join(', ') || 'Unknown'}
                </p>
              </div>
            </Link>
            {onRemove && (
              <button
                onClick={() => onRemove(item.bookId)}
                className="absolute top-2 right-2 w-7 h-7 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error/80"
              >
                <HiXMark className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
