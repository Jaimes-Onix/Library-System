
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import FeaturedCarousel from './FeaturedCarousel';
import Library from './Library';
import { LibraryBook, Theme, LibraryFilter } from '../types';

interface LibraryPageProps {
    theme: Theme;
    books: LibraryBook[];
    onSelectBook: (book: LibraryBook) => void;
    onAddNew: () => void;
    onRemoveBook: (id: string) => void;
    onToggleFavorite: (id: string) => void;
}

const LibraryPage: React.FC<LibraryPageProps> = ({
    theme,
    books,
    onSelectBook,
    onAddNew,
    onRemoveBook,
    onToggleFavorite
}) => {
    const [searchParams] = useSearchParams();
    const activeFilter = (searchParams.get('category') || searchParams.get('filter') || 'all') as LibraryFilter;
    const isDark = theme === 'dark';

    return (
        <div className="h-full overflow-y-auto no-scrollbar">
            {books.length > 0 && activeFilter === 'all' && (
                <FeaturedCarousel books={books.slice(0, 5)} darkMode={isDark} />
            )}
            <Library
                books={books}
                filter={activeFilter}
                darkMode={isDark}
                onSelectBook={onSelectBook}
                onAddNew={onAddNew}
                onRemoveBook={onRemoveBook}
            />
        </div>
    );
};

export default LibraryPage;
