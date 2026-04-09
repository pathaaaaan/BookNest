import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactReader } from 'react-reader';
import { getBookById } from '../api/bookApi';
import { saveProgress, getProgress } from '../api/readingApi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { HiArrowLeft } from 'react-icons/hi2';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function ReaderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  
  const [book, setBook] = useState(null);
  const [epubUrl, setEpubUrl] = useState(null);
  const [location, setLocation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toc, setToc] = useState([]);
  
  const progressSaveTimeout = useRef(null);
  const renditionRef = useRef(null);

  useEffect(() => {
    const initReader = async () => {
      try {
        const bookRes = await getBookById(id);
        const bookData = bookRes.data.data;
        setBook(bookData);

        if (!bookData.iaIdentifiers || bookData.iaIdentifiers.length === 0) {
          setError('No EPUB file available for this book.');
          setLoading(false);
          return;
        }

        // Open Library / Internet Archive EPUB URL construct
        // Note: Using the first available IA identifier to fetch the unencrypted epub
        const iaId = bookData.iaIdentifiers[0];
        const url = `https://archive.org/download/${iaId}/${iaId}.epub`;
        setEpubUrl(url);

        if (isAuthenticated) {
          const progRes = await getProgress(id);
          if (progRes.data.data?.currentLocation) {
            setLocation(progRes.data.data.currentLocation);
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load book data.');
      } finally {
        setLoading(false);
      }
    };

    initReader();
  }, [id, isAuthenticated]);

  const handleLocationChanged = (epubcfi) => {
    setLocation(epubcfi);
    
    // Auto-save progress, debounced
    if (isAuthenticated && epubcfi && renditionRef.current) {
      if (progressSaveTimeout.current) clearTimeout(progressSaveTimeout.current);
      
      progressSaveTimeout.current = setTimeout(async () => {
        try {
          const locationData = renditionRef.current.location;
          // Calculate rough percentage
          let progressPct = 0;
          if (locationData && locationData.start && locationData.start.percentage) {
            progressPct = locationData.start.percentage * 100;
          }

          await saveProgress({
            bookId: id,
            bookTitle: book.title,
            coverUrl: book.coverUrl,
            currentLocation: epubcfi,
            progress: progressPct,
          });
        } catch (err) {
          console.error('Failed to save progress:', err);
        }
      }, 2000); // Wait 2s after turning page before saving
    }
  };

  const getReaderStyles = () => {
    if (isDark) {
      return {
        readerArea: { backgroundColor: '#0F0D15', transition: 'all .3s ease' },
        container: { backgroundColor: '#0F0D15' },
        tocArea: { backgroundColor: '#1A1625', color: '#F1F0F5' },
        tocButtonExpanded: { backgroundColor: '#251F33' },
        tocButtonBar: { background: '#F1F0F5' },
        arrow: { color: '#8B5CF6' }
      };
    }
    return {
      readerArea: { backgroundColor: '#FAFAFA', transition: 'all .3s ease' },
      container: { backgroundColor: '#FAFAFA' },
      arrow: { color: '#7C3AED' }
    };
  };

  const renditionStyles = isDark ? {
    body: { background: '#0F0D15 !important', color: '#F1F0F5 !important' },
    p: { color: '#F1F0F5 !important', fontSize: '18px !important', lineHeight: '1.6 !important' },
    h1: { color: '#8B5CF6 !important' },
    h2: { color: '#8B5CF6 !important' },
    a: { color: '#06B6D4 !important' }
  } : {
    body: { background: '#FAFAFA !important', color: '#1F2937 !important' },
    p: { fontSize: '18px !important', lineHeight: '1.6 !important' },
    h1: { color: '#7C3AED !important' },
    h2: { color: '#7C3AED !important' }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><LoadingSpinner size="lg" text="Loading EPUB..." /></div>;
  if (error) return (
    <div className="h-screen flex flex-col items-center justify-center p-4">
      <div className="text-4xl mb-4">📖</div>
      <h2 className="text-xl text-text-primary mb-2 font-bold">Cannot load reader</h2>
      <p className="text-text-secondary text-center max-w-md mb-6">{error}</p>
      <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-surface border border-border text-text-primary rounded-xl hover:bg-surface-hover">
        Go Back
      </button>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-bg-primary overflow-hidden">
      {/* Top Bar */}
      <div className="h-16 flex-shrink-0 glass border-b border-border/50 flex items-center justify-between px-4 z-10 relative">
        <button 
          onClick={() => navigate(`/book/${id}`)}
          className="p-2 -ml-2 text-text-secondary hover:text-text-primary hover:bg-surface rounded-xl transition-colors flex items-center gap-2"
        >
          <HiArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">Back</span>
        </button>
        <h1 className="text-text-primary font-medium truncate max-w-[50%] absolute left-1/2 -translate-x-1/2">
          {book?.title}
        </h1>
        <div className="w-10">
          {/* Theme toggler or settings could go here */}
        </div>
      </div>

      {/* Reader Area */}
      <div className="flex-1 relative">
        <ReactReader
          url={epubUrl}
          location={location}
          locationChanged={handleLocationChanged}
          tocChanged={toc => setToc(toc)}
          getRendition={(rendition) => {
            renditionRef.current = rendition;
            rendition.themes.register('custom', renditionStyles);
            rendition.themes.select('custom');
          }}
          styles={getReaderStyles()}
        />
      </div>
    </div>
  );
}
