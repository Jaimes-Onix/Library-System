
import React, { useState, useRef, useEffect, useCallback, useMemo, ErrorInfo, ReactNode } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import { BookOpen, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import Header from './components/Header';
import Upload from './components/Upload';
import BookViewer from './components/BookViewer';
import LibraryPage from './components/LibraryPage';
import Sidebar from './components/Sidebar';
import LibraryActionModal from './components/LibraryActionModal';
import AccountSettingsModal from './components/AccountSettingsModal';
import Auth from './components/Auth';
import DashboardHome from './components/DashboardHome';
import ExamplesPage from './components/ExamplesPage';
import FeaturesPage from './components/FeaturesPage';
import { BookRef, LibraryBook, UserProfile, Category, BookCategory, Theme } from './types';
import { Toaster } from './utils/toast';
import { useAuth } from './context/AuthContext';
import AdminDashboard from './components/AdminDashboard';
import AdminAuth from './components/AdminAuth';
import VantaFog from './components/VantaFog';
import Landing from './components/Landing';
import Home from './components/Home';
import {
  uploadPDF,
  uploadCover,
  saveBookMetadata,
  loadBooks,
  updateBook,
  deleteBook,
  StoredBook
} from './services/bookStorage';

// Configure PDF.js worker — use Vite ?url import for reliable version matching
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

// --- Helper: Generate cover image from first page of PDF ---
async function generateCoverFromPDF(pdfDoc: any): Promise<string> {
  const page = await pdfDoc.getPage(1);
  const viewport = page.getViewport({ scale: 1.5 });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d')!;
  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas.toDataURL('image/jpeg', 0.85);
}

// --- Helper: Convert StoredBook (DB) → LibraryBook (UI) ---
function storedToLibraryBook(stored: StoredBook): LibraryBook {
  return {
    id: stored.id,
    name: stored.title || stored.original_filename,
    doc: null, // Lazy-loaded when reader opens
    pdfUrl: stored.pdf_url,
    coverUrl: stored.cover_url || '',
    totalPages: stored.total_pages,
    summary: stored.summary || undefined,
    category: (stored.category as Category) || undefined,
    isFavorite: stored.is_favorite,
  };
}

// --- Error Boundary ---
interface EBProps { children?: ReactNode }
interface EBState { hasError: boolean; error: Error | null; errorInfo: ErrorInfo | null }

class ErrorBoundary extends React.Component<EBProps, EBState> {
  constructor(props: EBProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error: Error): Partial<EBState> {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error("APP_CRASH_REPORTED:", error, errorInfo);
  }
  handleReset = () => window.location.reload();
  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white p-12 text-[#1d1d1f]">
          <div className="max-w-xl w-full text-center">
            <h1 className="text-4xl font-black mb-4 tracking-tight">System Exception</h1>
            <p className="text-lg text-gray-500 mb-8 font-medium">The interface encountered a fatal error.</p>
            <button onClick={this.handleReset} className="px-12 py-5 bg-black text-white rounded-[22px] font-black flex items-center gap-3 mx-auto transition-all active:scale-95 shadow-2xl hover:bg-gray-800">
              <RefreshCw size={22} strokeWidth={2.5} /> Rebuild Interface
            </button>
          </div>
        </div>
      );
    }
    return this.props.children || null;
  }
}

// --- Layout Component ---
const AppLayout = ({
  children,
  theme,
  userProfile,
  onLogout,
  onToggleTheme,
  onOpenSettings,
  isAuthenticated,
  onAuth
}: any) => {
  const location = useLocation();
  const isPublicPage = ['/', '/home', '/examples', '/features', '/login', '/signup'].includes(location.pathname);

  // Show sidebar only if authenticated and NOT on strictly public landing pages/login
  const showSidebar = isAuthenticated && !isPublicPage && !location.pathname.startsWith('/reader') && !location.pathname.startsWith('/admin');

  return (
    <div className={`flex flex-col min-h-screen w-full transition-colors duration-700 selection:bg-blue-500 selection:text-white relative ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-[#f5f5f7] text-gray-900'}`}>
      {theme === 'dark' && !isPublicPage && <VantaFog />}

      <div className={`relative z-10 flex min-h-screen w-full ${showSidebar ? 'flex-row' : 'flex-col'}`}>
        {showSidebar && (
          <div className="sticky top-0 h-screen flex-shrink-0">
            <Sidebar
              theme={theme}
              userProfile={userProfile}
              onLogout={onLogout}
              onToggleTheme={onToggleTheme}
              onOpenSettings={onOpenSettings}
            />
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0 relative">
          {!location.pathname.startsWith('/reader') && !location.pathname.startsWith('/admin') && !['/login', '/signup'].includes(location.pathname) && (
            <Header
              theme={theme}
              isAuthenticated={isAuthenticated}
              userProfile={userProfile}
              onAuth={onAuth}
              onOpenSettings={onOpenSettings}
              hasSidebar={showSidebar}
            />
          )}

          <main className={`flex-1 relative transition-colors duration-700 ${theme === 'dark' ? 'bg-transparent' : 'bg-transparent'} ${!isPublicPage ? 'h-full overflow-hidden' : ''} ${!showSidebar && !isPublicPage ? 'pt-14' : ''}`}>
            <Outlet />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { user, profile, isAdmin, loading, signOut } = useAuth();
  const [theme, setTheme] = useState<Theme>('dark');
  const navigate = useNavigate();

  // State
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<LibraryBook | null>(null);
  const [pendingBook, setPendingBook] = useState<LibraryBook | null>(null);
  const [readerMode, setReaderMode] = useState<'manual' | 'preview'>('manual');
  const [currentPage, setCurrentPage] = useState(0);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isLoadingBook, setIsLoadingBook] = useState(false);

  const bookRef = useRef<BookRef | null>(null);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Derived Profile
  const derivedProfile = useMemo(() => {
    if (profile) {
      const displayName = profile.name || profile.full_name || profile.email || "U";
      return { ...profile, name: displayName, initials: displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) };
    }
    if (user) {
      const displayName = (user as any).full_name || user.username || user.email || "U";
      return {
        id: user.id, email: user.email!, name: displayName, role: 'user', created_at: new Date().toISOString(),
        photo_url: (user as any).photo_url, photoUrl: (user as any).photo_url,
        initials: displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
      } as UserProfile;
    }
    return null;
  }, [user, profile]);

  // ─── Load books from Supabase on login ───
  useEffect(() => {
    if (!user) {
      setBooks([]);
      return;
    }
    let cancelled = false;
    const fetchBooks = async () => {
      try {
        const stored = await loadBooks();
        if (!cancelled) {
          setBooks(stored.map(storedToLibraryBook));
        }
      } catch (err) {
        console.error('Failed to load books:', err);
      }
    };
    fetchBooks();
    return () => { cancelled = true; };
  }, [user]);

  // ─── Upload handler: PDF → parse → cover → Supabase ───
  const handleFilesSelect = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setUploadLoading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        setUploadStatus(`Parsing "${file.name}" (${i + 1}/${files.length})...`);

        // 1. Parse PDF locally to get page count & cover
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const totalPages = pdfDoc.numPages;

        setUploadStatus(`Generating cover for "${file.name}"...`);

        // 2. Generate cover image from first page
        const coverBase64 = await generateCoverFromPDF(pdfDoc);

        setUploadStatus(`Uploading "${file.name}" to storage...`);

        // 3. Upload PDF file to Supabase Storage
        const pdfUrl = await uploadPDF(file);

        // 4. Upload cover image to Supabase Storage
        const tempId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const coverUrl = await uploadCover(coverBase64, tempId);

        setUploadStatus(`Saving "${file.name}" to library...`);

        // 5. Save metadata to database
        const stored = await saveBookMetadata({
          title: file.name.replace('.pdf', ''),
          original_filename: file.name,
          pdf_url: pdfUrl,
          cover_url: coverUrl,
          total_pages: totalPages,
          file_size: file.size,
        });

        // 6. Add to local state (doc already parsed so keep it)
        const newBook: LibraryBook = {
          id: stored.id,
          name: stored.title || file.name,
          doc: pdfDoc,
          pdfUrl: stored.pdf_url,
          coverUrl: stored.cover_url || coverBase64,
          totalPages: totalPages,
          category: undefined,
          isFavorite: false,
        };
        setBooks(prev => [newBook, ...prev]);

      } catch (err: any) {
        console.error(`Upload failed for ${file.name}:`, err);
        alert(`Failed to upload "${file.name}": ${err.message}`);
      }
    }

    setUploadLoading(false);
    setUploadStatus('');
    navigate('/library');
  }, [navigate]);

  // ─── Open reader: lazy-load PDF doc if needed ───
  const openReader = useCallback(async (book: LibraryBook, mode: 'manual' | 'preview' = 'manual') => {
    setReaderMode(mode);
    setCurrentPage(0);

    if (book.doc) {
      // Already parsed — open immediately
      setSelectedBook(book);
      navigate(`/reader/${book.id}`);
      return;
    }

    // Need to fetch and parse the PDF from its URL
    if (!book.pdfUrl) {
      alert('No PDF URL available for this book.');
      return;
    }

    setIsLoadingBook(true);
    try {
      const response = await fetch(book.pdfUrl);
      const arrayBuffer = await response.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      // Update the book in state with the parsed doc
      const updatedBook = { ...book, doc: pdfDoc };
      setBooks(prev => prev.map(b => b.id === book.id ? updatedBook : b));
      setSelectedBook(updatedBook);
      setPendingBook(null);
      navigate(`/reader/${book.id}`);
    } catch (err: any) {
      console.error('Failed to load PDF:', err);
      alert(`Failed to load book: ${err.message}`);
    } finally {
      setIsLoadingBook(false);
    }
  }, [navigate]);

  // ─── Delete book via Supabase ───
  const handleRemoveBook = useCallback(async (id: string) => {
    const book = books.find(b => b.id === id);
    if (!book) return;

    try {
      await deleteBook(id, book.pdfUrl || '', book.coverUrl);
      setBooks(prev => prev.filter(b => b.id !== id));
      setPendingBook(null);
    } catch (err: any) {
      console.error('Delete failed:', err);
      // Still remove locally even if Supabase fails
      setBooks(prev => prev.filter(b => b.id !== id));
      setPendingBook(null);
    }
  }, [books]);

  // ─── Toggle favorite via Supabase ───
  const handleToggleFavorite = useCallback(async (id: string) => {
    const book = books.find(b => b.id === id);
    if (!book) return;

    const newFav = !book.isFavorite;
    // Optimistic update
    setBooks(prev => prev.map(b => b.id === id ? { ...b, isFavorite: newFav } : b));

    try {
      await updateBook(id, { is_favorite: newFav });
    } catch (err) {
      console.error('Toggle favorite failed:', err);
      // Revert on failure
      setBooks(prev => prev.map(b => b.id === id ? { ...b, isFavorite: !newFav } : b));
    }
  }, [books]);

  // ─── Apply summary via Supabase ───
  const handleApplySummary = useCallback(async (id: string, summary: string) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, summary } : b));
    try {
      await updateBook(id, { summary });
    } catch (err) {
      console.error('Apply summary failed:', err);
    }
  }, []);

  // ─── Update category via Supabase ───
  const handleUpdateCategory = useCallback(async (id: string, category?: BookCategory) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, category } : b));
    try {
      await updateBook(id, { category: category || null });
    } catch (err) {
      console.error('Update category failed:', err);
    }
  }, []);

  const handleAuthSuccess = (newProfile: UserProfile) => {
    navigate('/home');
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-black text-white"><Loader2 className="animate-spin" /></div>;

  return (
    <ErrorBoundary>
      <Toaster />
      <AppLayout
        theme={theme}
        userProfile={derivedProfile}
        onLogout={signOut}
        onToggleTheme={toggleTheme}
        onOpenSettings={() => setIsAccountSettingsOpen(true)}
        isAuthenticated={!!user}
        onAuth={() => navigate('/login')}
      >
        <Routes>
          <Route path="/" element={
            user ? <Navigate to="/library/home" /> : <Navigate to="/home" />
          } />
          <Route path="/home" element={
            <Home
              theme={theme}
              onStart={() => user ? navigate('/library/home') : navigate('/login')}
              onViewExamples={() => navigate('/examples')}
            />
          } />
          <Route path="/examples" element={<ExamplesPage theme={theme} onSelectSample={() => user ? navigate('/library/home') : navigate('/login')} />} />
          <Route path="/features" element={<FeaturesPage theme={theme} />} />

          <Route path="/login" element={<Auth onAuthSuccess={handleAuthSuccess} onBack={() => navigate('/')} initialMode="signin" />} />
          <Route path="/signup" element={<Auth onAuthSuccess={handleAuthSuccess} onBack={() => navigate('/')} initialMode="signup" />} />

          <Route path="/library/home" element={
            user ? <DashboardHome theme={theme} books={books} onUpload={() => navigate('/upload')} onGoToLibrary={() => navigate('/library')} />
              : <Navigate to="/login" />
          } />

          <Route path="/library" element={
            user ? <LibraryPage
              theme={theme}
              books={books}
              onSelectBook={(book) => setPendingBook(book)}
              onAddNew={() => navigate('/upload')}
              onRemoveBook={handleRemoveBook}
              onToggleFavorite={handleToggleFavorite}
            /> : <Navigate to="/login" />
          } />

          <Route path="/upload" element={
            user ? <Upload darkMode={theme === 'dark'} onFilesSelect={handleFilesSelect} onBack={() => navigate('/library')} isLoading={uploadLoading} statusMessage={uploadStatus} />
              : <Navigate to="/login" />
          } />

          <Route path="/reader/:bookId" element={
            selectedBook ? (
              <div className={`fixed inset-0 z-[60] animate-in fade-in duration-700 ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
                <button onClick={() => { navigate('/library'); setSelectedBook(null); }}
                  className={`fixed top-8 left-8 z-[110] p-4 backdrop-blur-md border transition-all shadow-2xl rounded-full ${theme === 'dark' ? 'bg-white/10 border-white/10 text-white hover:bg-white hover:text-black' : 'bg-black/5 border-black/5 text-black hover:bg-black hover:text-white'}`}>
                  <BookOpen size={24} />
                </button>
                <BookViewer
                  pdfDocument={selectedBook.doc}
                  onFlip={setCurrentPage}
                  onBookInit={(b) => { if (b) bookRef.current = { pageFlip: () => b.pageFlip() }; }}
                  autoPlay={readerMode === 'preview'}
                />
              </div>
            ) : <Navigate to="/library" />
          } />

          <Route path="/admin/*" element={
            user ? (isAdmin ? <AdminDashboard theme="dark" onExit={() => navigate('/library/home')} onLogout={signOut} /> : <Navigate to="/library/home" />)
              : <AdminAuth />
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AppLayout>

      <LibraryActionModal
        book={pendingBook}
        onClose={() => setPendingBook(null)}
        onSelectMode={(m) => { if (pendingBook) openReader(pendingBook, m); }}
        onApplySummary={handleApplySummary}
        onUpdateCategory={handleUpdateCategory}
        isSummarizing={isSummarizing}
        isLoadingBook={isLoadingBook}
        onRemove={handleRemoveBook}
        onToggleFavorite={handleToggleFavorite}
      />

      {derivedProfile && <AccountSettingsModal isOpen={isAccountSettingsOpen} onClose={() => setIsAccountSettingsOpen(false)} userProfile={derivedProfile} onSave={() => setIsAccountSettingsOpen(false)} theme={theme} onLogout={signOut} />}
    </ErrorBoundary>
  );
};

export default App;
