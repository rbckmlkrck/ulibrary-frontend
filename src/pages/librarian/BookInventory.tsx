import React, { useState, useEffect } from 'react';
import api from '../../services/api';

interface InventoryBook {
    id: number;
    title: string;
    author: string;
    published_year: number;
    genre: string;
    stock: number;
    checked_out_count: number;
    available: number;
}

interface PaginatedInventoryResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: InventoryBook[];
}

const PAGE_SIZE = 100;

const BookInventory: React.FC = () => {
    const [books, setBooks] = useState<InventoryBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // Debounce search term and reset page on new search
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1);
        }, 300);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    // Fetch books when debounced search term or current page changes
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const response = await api.get<PaginatedInventoryResponse>(
                    `/books/?search=${debouncedSearchTerm}&page=${currentPage}&page_size=${PAGE_SIZE}`
                );
                setBooks(response.data?.results || []);
                setTotalPages(Math.ceil((response.data?.count || 0) / PAGE_SIZE));
                setError(null);
            } catch (err) {
                setError('Failed to fetch book inventory.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [debouncedSearchTerm, currentPage]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Book Inventory</h1>
            <div className="form-control mb-4">
                <input
                    type="text"
                    placeholder="Search by title, author, or genre..."
                    className="input input-bordered w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading && <div className="flex justify-center"><span className="loading loading-spinner"></span></div>}
            {error && <div className="alert alert-error"><span>{error}</span></div>}

            {!loading && !error && (
                <>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Genre</th>
                                    <th>Published</th>
                                    <th>Total Stock</th>
                                    <th>Checked Out</th>
                                    <th>Available</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.length > 0 ? (
                                    books.map(book => (
                                        <tr key={book.id} className="hover">
                                            <td>{book.title}</td>
                                            <td>{book.author}</td>
                                            <td>{book.genre}</td>
                                            <td>{book.published_year}</td>
                                            <td>{book.stock}</td>
                                            <td>{book.checked_out_count}</td>
                                            <td>{book.available}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center">
                                            {searchTerm ? 'No matching books found.' : 'The library has no books.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-4">
                            <div className="join">
                                <button
                                    className="join-item btn"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    «
                                </button>
                                <button className="join-item btn btn-disabled">
                                    Page {currentPage} of {totalPages}
                                </button>
                                <button
                                    className="join-item btn"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    »
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default BookInventory;