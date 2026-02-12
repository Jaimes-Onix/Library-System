
export interface PDFDocumentProxy {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PDFPageProxy>;
  destroy: () => void;
}

export interface PDFPageProxy {
  getViewport: (params: { scale: number }) => PDFPageViewport;
  render: (params: {
    canvasContext: CanvasRenderingContext2D | null;
    viewport: PDFPageViewport;
  }) => { promise: Promise<void> };
}

export interface PDFPageViewport {
  width: number;
  height: number;
  scale: number;
}

export type Category = 'philippines' | 'internal' | 'international' | 'ph_interns' | 'Uncategorized';

// BookCategory matches the database column type
export type BookCategory = 'philippines' | 'internal' | 'international' | 'ph_interns';

// LibraryFilter used by Sidebar and Library components
export type LibraryFilter = 'all' | 'favorites' | 'philippines' | 'internal' | 'international' | 'ph_interns';

export interface LibraryBook {
  id: string;
  name: string;
  doc: any;
  pdfUrl?: string;
  coverUrl: string;
  totalPages: number;
  summary?: string;
  category?: Category;
  isFavorite?: boolean;
}

export interface BookRef {
  pageFlip: () => {
    flipNext: () => void;
    flipPrev: () => void;
    turnToPage: (page: number) => void;
    getCurrentPageIndex: () => number;
    getPageCount: () => number;
  } | null;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  user?: string; // Legacy field, optional now
  initials?: string; // Legacy field, optional now
  photoUrl?: string; // Legacy field
  student_id?: string;
  grade_section?: string;
  course?: string;
  status?: 'active' | 'fines' | 'suspended';
  photo_url?: string;
}

export type Theme = 'light' | 'dark';

export type AppView = 'landing' | 'home' | 'examples' | 'features' | 'library' | 'upload' | 'reader' | 'admin' | 'settings';

export type VerificationStatus = 'pending' | 'verified' | 'expired' | 'error';

export interface QRVerificationState {
  email: string;
  token: string;
  status: VerificationStatus;
  expiresAt: number;
}
