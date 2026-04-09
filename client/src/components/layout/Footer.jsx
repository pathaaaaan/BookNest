import { HiBookOpen } from 'react-icons/hi2';

export default function Footer() {
  return (
    <footer className="border-t border-border/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
              <HiBookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold gradient-text">BookNest</span>
          </div>
          <p className="text-text-muted text-sm">
            © {new Date().getFullYear()} BookNest. Powered by Open Library.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://openlibrary.org" target="_blank" rel="noopener noreferrer"
              className="text-text-muted text-sm hover:text-primary transition-colors">
              Open Library
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
