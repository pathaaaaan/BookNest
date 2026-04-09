import { Link } from 'react-router-dom';
import { HiPlayCircle } from 'react-icons/hi2';

export default function ContinueReading({ progressList }) {
  if (!progressList || progressList.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
        <HiPlayCircle className="w-6 h-6 text-primary" />
        Continue Reading
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {progressList.map((item) => (
          <Link
            key={item.bookId}
            to={`/reader/${item.bookId}`}
            className="flex gap-4 bg-surface border border-border rounded-2xl p-4 card-hover group"
          >
            {item.coverUrl ? (
              <img
                src={item.coverUrl}
                alt={item.bookTitle}
                className="w-16 h-24 rounded-xl object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-24 rounded-xl bg-bg-tertiary flex items-center justify-center flex-shrink-0 text-2xl">
                📖
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
                {item.bookTitle || 'Untitled'}
              </h3>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                  <span>Progress</span>
                  <span>{Math.round(item.progress)}%</span>
                </div>
                <div className="w-full h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-primary rounded-full transition-all duration-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
