import { Link } from 'react-router-dom';
import { HiBookOpen, HiStar } from 'react-icons/hi2';

const PLACEHOLDER_COVER = 'data:image/svg+xml;base64,' + btoa(`
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300">
  <rect fill="#1E1A2B" width="200" height="300" rx="8"/>
  <text fill="#6B7280" font-family="system-ui" font-size="40" text-anchor="middle" x="100" y="160">Book</text>
</svg>`);

export default function BookCard({ book }) {
  const { olKey, title, authors, coverUrl, firstPublishYear, rating } = book;

  return (
    <Link
      to={`/book/${olKey}`}
      className="group block bg-surface rounded-2xl overflow-hidden border border-border/50 card-hover"
    >
      {/* Cover Image */}
      <div className="relative aspect-[2/3] overflow-hidden bg-bg-tertiary">
        <img
          src={coverUrl || PLACEHOLDER_COVER}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { e.target.src = PLACEHOLDER_COVER; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hover overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <span className="px-3 py-1.5 bg-primary/90 backdrop-blur-sm text-white text-xs font-medium rounded-lg flex items-center gap-1.5">
            <HiBookOpen className="w-3.5 h-3.5" />
            View Details
          </span>
        </div>

        {/* Rating badge */}
        {rating > 0 && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg flex items-center gap-1">
            <HiStar className="w-3.5 h-3.5 text-accent" />
            <span className="text-white text-xs font-medium">{rating}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-text-primary font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-text-muted text-xs mt-1.5 line-clamp-1">
          {authors?.join(', ') || 'Unknown Author'}
        </p>
        {firstPublishYear && (
          <p className="text-text-muted/60 text-xs mt-1">{firstPublishYear}</p>
        )}
      </div>
    </Link>
  );
}
