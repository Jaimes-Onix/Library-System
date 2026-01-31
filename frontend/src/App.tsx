
import React, { Component, useState, useRef, useEffect, useMemo, ErrorInfo, ReactNode } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BookOpen, RefreshCw, ShieldAlert, AlertCircle } from 'lucide-react';
import Header from './components/Header';
import Upload from './components/Upload';
import BookViewer from './components/BookViewer';
import Controls from './components/Controls';
import Library from './components/Library';
import Sidebar from './components/Sidebar';
import LibraryActionModal from './components/LibraryActionModal';
import CategorySelectionModal from './components/CategorySelectionModal';
import FeaturedCarousel from './components/FeaturedCarousel';
import AccountSettingsModal from './components/AccountSettingsModal';
import Auth from './components/Auth';
import Home from './components/Home';
import ExamplesPage from './components/ExamplesPage';
import FeaturesPage from './components/FeaturesPage';
import { getDocument } from './utils/pdfUtils';
import { BookRef, LibraryBook, UserProfile, Category, Theme, AppView } from './types';
import { Toaster } from './utils/toast';
import { useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';
import AdminDashboard from './components/AdminDashboard';

const generateSafeId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

interface EBProps { children?: ReactNode }
interface EBState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null
}

// Fixed ErrorBoundary by using React.Component explicitly to resolve type inheritance issues
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
            <div className="mb-8 inline-flex p-6 bg-red-50 text-red-500 rounded-[32px] animate-pulse">
              <AlertCircle size={48} strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-black mb-4 tracking-tight">System Exception</h1>
            <p className="text-lg text-gray-500 mb-8 font-medium">
              The interface encountered a fatal error during rendering.
            </p>

            <div className="bg-gray-50 p-6 rounded-[24px] text-left font-mono text-xs mb-10 overflow-auto max-h-[300px] border border-gray-100 text-red-600">
              <p className="font-black mb-2 uppercase tracking-widest text-gray-400">Error Details:</p>
              <p className="font-bold mb-4">{this.state.error?.toString()}</p>
              <p className="opacity-70">{this.state.error?.stack}</p>
            </div>

            <button
              onClick={this.handleReset}
              className="px-12 py-5 bg-black text-white rounded-[22px] font-black flex items-center gap-3 mx-auto transition-all active:scale-95 shadow-2xl hover:bg-gray-800"
            >
              <RefreshCw size={22} strokeWidth={2.5} />
              Rebuild Interface
            </button>
          </div>
        </div>
      );
    }
    return this.props.children || null;
  }
}

const FlipBookAppContent: React.FC = () => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [isShowingAuth, setIsShowingAuth] = useState(false);

  const [theme, setTheme] = useState<Theme>('light');
  const [view, setView] = useState<AppView | 'admin'>('landing');

  useEffect(() => {
    console.log('[APP] View changed to:', view);
  }, [view]);

  const handleSetView = (newView: AppView | 'admin') => {
    console.log('[APP] Setting view to:', newView);
    setView(newView);
  };

  // Auto-redirect to landing when user logs out
  useEffect(() => {
    if (!user && view !== 'landing' && view !== 'examples' && view !== 'features') {
      console.log('[APP] User logged out, redirecting to landing');
      setView('landing');
      setSelectedBook(null);
      setPendingBook(null);
    }
  }, [user, view]);

  const [readerMode, setReaderMode] = useState<'manual' | 'preview'>('manual');
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<LibraryBook | null>(null);
  const [pendingBook, setPendingBook] = useState<LibraryBook | null>(null);

  const [categorizingBooks, setCategorizingBooks] = useState<LibraryBook[]>([]);
  const [currentCategorizingIndex, setCurrentCategorizingIndex] = useState(-1);

  const [currentPage, setCurrentPage] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [libraryFilter, setLibraryFilter] = useState('all');
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);

  // Close auth modal when user logs in
  useEffect(() => {
    if (user) {
      setIsShowingAuth(false);
    }
  }, [user]);

  // Fetch books from Supabase
  useEffect(() => {
    if (user) {
      fetchBooks();
    } else {
      setBooks([]);
    }
  }, [user]);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (data) {
        const loadedBooks: LibraryBook[] = data.map((b: any) => ({
          id: b.id,
          name: b.title,
          doc: null, // Load only when opened
          coverUrl: b.cover_url,
          totalPages: b.total_pages || 0,
          isFavorite: false,
          category: 'Uncategorized'
        }));
        setBooks(loadedBooks);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const bookRef = useRef<BookRef | null>(null);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const triggerAutoSummary = async (bookId: string, doc: any) => {
    if (!process.env.API_KEY) return;
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const page = await doc.getPage(1);
      const textContent = await page.getTextContent();
      const text = textContent.items.map((i: any) => i.str).join(' ').slice(0, 1500);

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this text and write a single, sophisticated, "Apple-style" marketing hook (max 18 words) that describes the essence of this document. It should sound premium and inviting. Text: "${text}"`,
      });

      const summary = response.text?.trim() || "A curated digital experience.";
      setBooks(prev => prev.map(b => b.id === bookId ? { ...b, summary } : b));
    } catch (err) {
      console.warn("Background AI hook failed:", err);
    }
  };

  const extractCover = async (doc: any): Promise<string> => {
    try {
      const page = await doc.getPage(1);
      const viewport = page.getViewport({ scale: 0.3 }); // Reduced for speed
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return "";
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: ctx, viewport: viewport }).promise;
      return canvas.toDataURL('image/jpeg', 0.4); // Lower quality for faster upload
    } catch { return ""; }
  };

  const handleFilesSelect = async (files: File[]) => {
    // Validate PDFs upfront
    const pdfFiles = files.filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (pdfFiles.length === 0) {
      alert("Please upload PDF files only");
      return;
    }
    if (pdfFiles.length !== files.length) {
      alert(`${files.length - pdfFiles.length} non-PDF file(s) skipped`);
    }

    setLoadingStatus("Uploading to Cloud...");
    try {
      for (const file of pdfFiles) {
        console.log(`[UPLOAD] Starting upload for: ${file.name}`);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${user?.id}/${fileName}`;

        // 1. Upload File
        console.log(`[UPLOAD] Step 1: Uploading PDF to storage...`);
        const { error: uploadError } = await supabase.storage
          .from('books')
          .upload(filePath, file);

        if (uploadError) {
          console.error("[UPLOAD] Storage upload failed:", uploadError);
          throw uploadError;
        }
        console.log(`[UPLOAD] Step 1: PDF uploaded successfully`);

        // 2. Generate Cover & Info
        console.log(`[UPLOAD] Step 2: Parsing PDF...`);
        let doc = null;
        let coverUrl = "";
        let publicCoverUrl = "";
        let totalPages = 0;

        try {
          doc = await getDocument(file);
          totalPages = doc?.numPages || 0;
          console.log(`[UPLOAD] PDF parsed: ${totalPages} pages`);

          console.log(`[UPLOAD] Step 3: Generating cover...`);
          if (doc) {
            coverUrl = await extractCover(doc);
            console.log(`[UPLOAD] Cover extracted: ${coverUrl ? 'success' : 'failed'}`);

            // Upload Cover to public bucket for easier access
            if (coverUrl) {
              console.log(`[UPLOAD] Step 4: Uploading cover to storage...`);
              const coverBlob = await (await fetch(coverUrl)).blob();
              const coverPath = `${user?.id}/${fileName.replace('.pdf', '.jpg')}`;
              const { error: coverError } = await supabase.storage.from('covers').upload(coverPath, coverBlob);
              if (coverError) {
                console.warn("[UPLOAD] Cover upload failed, skipping:", coverError);
              } else {
                const { data: publicData } = supabase.storage.from('covers').getPublicUrl(coverPath);
                publicCoverUrl = publicData.publicUrl;
                console.log(`[UPLOAD] Cover uploaded successfully`);
              }
            }
          }
        } catch (pdfError) {
          console.warn("[UPLOAD] PDF parsing/cover generation failed, continuing anyway:", pdfError);
        }

        // 3. Insert Record
        console.log(`[UPLOAD] Step 5: Inserting database record...`);
        const { error: dbError } = await supabase.from('books').insert({
          user_id: user?.id,
          title: file.name,
          file_url: filePath,
          cover_url: publicCoverUrl || "",
          total_pages: totalPages
        });

        if (dbError) {
          console.error("[UPLOAD] Database insert failed:", dbError);
          throw dbError;
        }
        console.log(`[UPLOAD] Database record inserted successfully`);
      }

      console.log(`[UPLOAD] All files uploaded, fetching books...`);
      await fetchBooks();
      setLoadingStatus(null);
      handleSetView('library');
      console.log(`[UPLOAD] Complete!`);

    } catch (err: any) {
      console.error("[UPLOAD] Fatal error:", err);
      alert("Upload failed: " + err.message);
      setLoadingStatus(null);
    }
  };

  const handleCategorySelection = (category: Category) => {
    const book = categorizingBooks[currentCategorizingIndex];
    if (!book) return;

    const updatedBook = { ...book, category };
    setBooks(prev => [...prev, updatedBook]);

    if (currentCategorizingIndex < categorizingBooks.length - 1) {
      setCurrentCategorizingIndex(prev => prev + 1);
    } else {
      setCategorizingBooks([]);
      setCurrentCategorizingIndex(-1);
      handleSetView('library');
    }
  };

  const handleSummarize = async (id: string) => {
    if (!process.env.API_KEY) return "AI unavailable (Key missing)";
    const book = books.find(b => b.id === id);
    if (!book) return null;
    setIsSummarizing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const page = await book.doc.getPage(1);
      const textContent = await page.getTextContent();
      const text = textContent.items.map((i: any) => i.str).join(' ').slice(0, 1000);
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Summarize this document into a compelling 15-word masterpiece hook: "${text}"`,
      });
      return response.text || "Summary ready.";
    } catch { return "Summary ready."; }
    finally { setIsSummarizing(false); }
  };

  const filteredBooks = useMemo(() => {
    const safe = books.filter(b => b && b.doc);
    if (libraryFilter === 'favorites') return safe.filter(b => b.isFavorite);
    if (['Professional', 'Academic', 'Personal', 'Creative'].includes(libraryFilter)) {
      return safe.filter(b => b.category === libraryFilter);
    }
    return safe;
  }, [books, libraryFilter]);

  useEffect(() => {
    const loadSelectedBookDoc = async () => {
      if (view === 'reader' && selectedBook && !selectedBook.doc) {
        setLoadingStatus("Opening Masterpiece...");
        try {
          // Get the record from DB to get file_url
          const { data: b } = await supabase.from('books').select('file_url').eq('id', selectedBook.id).single();
          if (b?.file_url) {
            const { data: signedData } = await supabase.storage.from('books').createSignedUrl(b.file_url, 3600);
            if (signedData?.signedUrl) {
              const response = await fetch(signedData.signedUrl);
              const blob = await response.blob();
              const file = new File([blob], selectedBook.name, { type: 'application/pdf' });
              const doc = await getDocument(file);
              setSelectedBook(prev => prev ? { ...prev, doc } : null);
            }
          }
        } catch (e) {
          console.error("Error loading PDF", e);
        } finally {
          setLoadingStatus(null);
        }
      }
    };
    loadSelectedBookDoc();
  }, [view, selectedBook?.id]);

  if (isShowingAuth) return <Auth onAuthSuccess={() => setIsShowingAuth(false)} />;

  const isWebsiteView = ['landing', 'examples', 'features'].includes(view);

  // Simplified profile object for Sidebar since we are using fetched Profile
  const derivedProfile: UserProfile | null = profile
    ? {
      id: profile.id,
      email: profile.email,
      name: profile.name || profile.full_name || profile.email,
      role: profile.role || 'user',
      created_at: profile.created_at,
      photoUrl: profile.avatar_url || profile.photo_url, // Check both common conventions
      initials: (profile.name || profile.email || "U").substring(0, 2).toUpperCase()
    }
    : (user ? {
      id: user.id,
      email: user.email!,
      name: user.email!, // Fallback
      role: 'user',
      created_at: new Date().toISOString(),
      initials: (user.email || "U").substring(0, 2).toUpperCase()
    } : null);

  return (
    <div className={`flex flex-col min-h-screen w-full transition-colors duration-700 selection:bg-blue-500 selection:text-white ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <Toaster />
      <Header
        view={view}
        theme={theme}
        onNavigate={handleSetView}
        onOpenSettings={() => setIsAccountSettingsOpen(true)}
        onAuth={() => setIsShowingAuth(true)}
        isAuthenticated={!!user}
        userProfile={derivedProfile}
        fileName={selectedBook?.name}
      />

      <div className={`flex-1 flex pt-20 ${isWebsiteView ? 'flex-col' : 'overflow-hidden h-[calc(100vh-80px)]'}`}>
        {!isWebsiteView && user && (
          <Sidebar
            theme={theme}
            userProfile={derivedProfile!}
            activeFilter={libraryFilter}
            onFilterChange={setLibraryFilter}
            onLogout={signOut}
            onToggleTheme={toggleTheme}
            onOpenSettings={() => isAdmin ? handleSetView('admin') : setIsAccountSettingsOpen(true)}
          />
        )}

        <main className={`flex-1 relative transition-colors duration-700 ${theme === 'dark' ? 'bg-black' : 'bg-white'} ${!isWebsiteView ? 'h-full overflow-hidden' : ''}`}>
          {view === 'landing' && (
            <Home
              theme={theme}
              onStart={user ? () => handleSetView('library') : () => setIsShowingAuth(true)}
              onViewExamples={() => handleSetView('examples')}
            />
          )}

          {view === 'examples' && (
            <ExamplesPage theme={theme} onSelectSample={user ? () => handleSetView('library') : () => setIsShowingAuth(true)} />
          )}

          {view === 'features' && (
            <FeaturesPage theme={theme} />
          )}

          {view === 'admin' && isAdmin && (
            <AdminDashboard theme={theme} onExit={() => handleSetView('library')} />
          )}

          {view === 'upload' && (
            <Upload theme={theme} onFilesSelect={handleFilesSelect} onBack={() => handleSetView('library')} isLoading={!!loadingStatus} statusMessage={loadingStatus || ""} />
          )}

          {view === 'library' && (
            <div className="h-full overflow-y-auto no-scrollbar">
              {books.length > 0 && libraryFilter === 'all' && <FeaturedCarousel books={books.slice(0, 5)} theme={theme} />}
              <Library
                theme={theme}
                activeFilter={libraryFilter}
                books={filteredBooks}
                onSelectBook={setPendingBook}
                onAddNew={() => handleSetView('upload')}
                onRemoveBook={(id) => setBooks(b => b.filter(x => x && x.id !== id))}
                onToggleFavorite={(id) => setBooks(b => b.map(x => x && x.id === id ? { ...x, isFavorite: !x.isFavorite } : x))}
              />

            </div>
          )}

          {view === 'reader' && selectedBook && (
            <div className={`fixed inset-0 z-[60] animate-in fade-in duration-700 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
              <div className={`fixed top-0 left-0 w-full h-[3px] z-[100] ${theme === 'dark' ? 'bg-zinc-900' : 'bg-gray-100'}`}>
                <div className={`h-full transition-all duration-700 ${theme === 'dark' ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-black'}`} style={{ width: `${((currentPage + 1) / (selectedBook.totalPages || 1)) * 100}%` }} />
              </div>

              <button onClick={() => { handleSetView('library'); setSelectedBook(null); }}
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
          )}
        </main>
      </div>

      <LibraryActionModal
        theme={theme}
        book={pendingBook}
        onClose={() => setPendingBook(null)}
        onSelectMode={(m) => { setReaderMode(m); setSelectedBook(pendingBook); setPendingBook(null); handleSetView('reader'); setCurrentPage(0); }}
        onSummarize={handleSummarize}
        onApplySummary={(id, s) => setBooks(b => b.map(x => x && x.id === id ? { ...x, summary: s } : x))}
        isSummarizing={isSummarizing}
        onRemove={(id) => setBooks(b => b.filter(x => x && x.id !== id))}
        onToggleFavorite={(id) => setBooks(b => b.map(x => x && x.id === id ? { ...x, isFavorite: !x.isFavorite } : x))}
      />

      {currentCategorizingIndex !== -1 && categorizingBooks[currentCategorizingIndex] && (
        <CategorySelectionModal
          isOpen={true}
          bookName={categorizingBooks[currentCategorizingIndex].name}
          coverUrl={categorizingBooks[currentCategorizingIndex].coverUrl}
          onSelect={handleCategorySelection}
          theme={theme}
        />
      )}

      {derivedProfile && <AccountSettingsModal isOpen={isAccountSettingsOpen} onClose={() => setIsAccountSettingsOpen(false)} userProfile={derivedProfile} onSave={() => setIsAccountSettingsOpen(false)} theme={theme} onLogout={signOut} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <FlipBookAppContent />
    </ErrorBoundary>
  );
};

export default App;
