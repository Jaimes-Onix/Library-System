
import React, { useState, useRef, useEffect, useMemo, ErrorInfo, ReactNode } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { BookOpen, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import Header from './components/Header';
import Upload from './components/Upload';
import BookViewer from './components/BookViewer';
import Controls from './components/Controls';
import Library from './components/Library';
import LibraryPage from './components/LibraryPage';
import Sidebar from './components/Sidebar';
import LibraryActionModal from './components/LibraryActionModal';
import CategorySelectionModal from './components/CategorySelectionModal';
import FeaturedCarousel from './components/FeaturedCarousel';
import AccountSettingsModal from './components/AccountSettingsModal';
import Auth from './components/Auth';
import DashboardHome from './components/DashboardHome';
import ExamplesPage from './components/ExamplesPage';
import FeaturesPage from './components/FeaturesPage';
import { BookRef, LibraryBook, UserProfile, Category, Theme } from './types';
import { Toaster } from './utils/toast';
import { useAuth } from './context/AuthContext';
import AdminDashboard from './components/AdminDashboard';
import AdminAuth from './components/AdminAuth';
import VantaFog from './components/VantaFog';
import Landing from './components/Landing';
import Home from './components/Home';

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

  // State lifted from FlipBookAppContent
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<LibraryBook | null>(null);
  const [pendingBook, setPendingBook] = useState<LibraryBook | null>(null);
  const [readerMode, setReaderMode] = useState<'manual' | 'preview'>('manual');
  const [currentPage, setCurrentPage] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);

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

  const handleAuthSuccess = (newProfile: UserProfile) => {
    navigate('/home');
  };

  const openReader = (book: LibraryBook, mode: 'manual' | 'preview' = 'manual') => {
    setSelectedBook(book);
    setReaderMode(mode);
    setCurrentPage(0);
    navigate(`/reader/${book.id}`);
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
              onRemoveBook={(id) => setBooks(b => b.filter(x => x.id !== id))}
              onToggleFavorite={(id) => setBooks(b => b.map(x => x.id === id ? { ...x, isFavorite: !x.isFavorite } : x))}
            /> : <Navigate to="/login" />
          } />

          <Route path="/upload" element={
            user ? <Upload theme={theme} onFilesSelect={(files) => alert("Upload logic here")} onBack={() => navigate('/library')} isLoading={false} statusMessage="" />
              : <Navigate to="/login" />
          } />

          <Route path="/reader/:bookId" element={
            selectedBook ? (
              <div className={`fixed inset-0 z-[60] animate-in fade-in duration-700 ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
                {/* Reader UI - could be extracted to ReaderPage */}
                <div className={`fixed top-0 left-0 w-full h-[3px] z-[100] ${theme === 'dark' ? 'bg-zinc-900' : 'bg-gray-100'}`}>
                  <div className={`h-full transition-all duration-700 ${theme === 'dark' ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-black'}`} style={{ width: `${((currentPage + 1) / (selectedBook.totalPages || 1)) * 100}%` }} />
                </div>
                <button onClick={() => { navigate('/library'); setSelectedBook(null); }}
                  className={`fixed top-8 left-8 z-[110] p-4 backdrop-blur-md border transition-all shadow-2xl rounded-full ${theme === 'dark' ? 'bg-white/10 border-white/10 text-white hover:bg-white hover:text-black' : 'bg-black/5 border-black/5 text-black hover:bg-black hover:text-white'}`}>
                  <BookOpen size={24} />
                </button>
                <BookViewer
                  pdfDocument={selectedBook.doc}
                  onFlip={setCurrentPage}
                  onBookInit={(b) => { if (b) bookRef.current = { pageFlip: () => b.pageFlip() }; }}
                  mode={readerMode}
                  zoomLevel={zoomLevel}
                  onZoomChange={setZoomLevel}
                  theme={theme}
                />
                <Controls
                  theme={theme}
                  currentPage={currentPage}
                  totalPages={selectedBook.totalPages || 1}
                  zoomLevel={zoomLevel}
                  onZoomChange={setZoomLevel}
                  onNext={() => bookRef.current?.pageFlip()?.flipNext()}
                  onPrev={() => bookRef.current?.pageFlip()?.flipPrev()}
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
        theme={theme}
        book={pendingBook}
        onClose={() => setPendingBook(null)}
        onSelectMode={(m) => { if (pendingBook) openReader(pendingBook, m); setPendingBook(null); }}
        onSummarize={() => Promise.resolve("Summary")}
        onApplySummary={(id, s) => setBooks(b => b.map(x => x.id === id ? { ...x, summary: s } : x))}
        isSummarizing={isSummarizing}
        onRemove={(id) => setBooks(b => b.filter(x => x.id !== id))}
        onToggleFavorite={(id) => setBooks(b => b.map(x => x.id === id ? { ...x, isFavorite: !x.isFavorite } : x))}
      />

      {derivedProfile && <AccountSettingsModal isOpen={isAccountSettingsOpen} onClose={() => setIsAccountSettingsOpen(false)} userProfile={derivedProfile} onSave={() => setIsAccountSettingsOpen(false)} theme={theme} onLogout={signOut} />}
    </ErrorBoundary>
  );
};

export default App;
