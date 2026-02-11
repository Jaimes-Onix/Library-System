
import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import FeaturedCarousel from './FeaturedCarousel';
import Library from './Library';
import { LibraryBook, Theme } from '../types';

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
    const [searchParams, setSearchParams] = useSearchParams();
    const activeFilter = searchParams.get('category') || searchParams.get('filter') || 'all';

    const filteredBooks = useMemo(() => {
        const safe = books.filter(b => b && b.doc);
        if (activeFilter === 'favorites') return safe.filter(b => b.isFavorite);

        // Check if filter is a category
        if (['Professional', 'Academic', 'Personal', 'Creative'].includes(activeFilter)) {
            return safe.filter(b => b.category === activeFilter);
        }

        return safe;
    }, [books, activeFilter]);

    return (
        <div className="h-full overflow-y-auto no-scrollbar">
            {books.length > 0 && activeFilter === 'all' && <FeaturedCarousel books={books.slice(0, 5)} theme={theme} />}
            <Library
                theme={theme}
                activeFilter={activeFilter}
                books={filteredBooks}
                onSelectBook={onSelectBook}
                onAddNew={onAddNew}
                onRemoveBook={onRemoveBook}
                onToggleFavorite={onToggleFavorite}
            />
        </div>
    );
};

export default LibraryPage;
