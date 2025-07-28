import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNotification } from '../../hooks/useNotification';

interface Book {
    id: number;
    title: string;
    author: string;
    published_year: number;
    genre: string;
    stock: number;
    is_checked_out_by_user: boolean;
    available: number;
    checked_out_count: number;
}

interface PaginatedBooksResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Book[];
}

const PAGE_SIZE = 100;

const AvailableBooks: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const { notification, showNotification } = useNotification();
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    // Debounce search term and reset page on new search
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1);
        }, 300);
        return () => clearTimeout(timerId);
    }, [searchTerm]);

    // Fetch books when debounced search term or current page changes
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const response = await api.get<PaginatedBooksResponse>(
                    `/books/?search=${debouncedSearchTerm}&page=${currentPage}&page_size=${PAGE_SIZE}`
                );
                setBooks(response.data?.results || []);
                setTotalPages(Math.ceil((response.data?.count || 0) / PAGE_SIZE));
                setError(null);
            } catch (err) {
                setError('Failed to fetch available books.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, [debouncedSearchTerm, currentPage]);

    const handleCheckout = async (bookId: number) => {
        if (!bookId) return;
        try {
            await api.post('/checkouts/', { book: bookId });
            showNotification({ message: 'Book checked out successfully!', type: 'success' });
            setBooks(prevBooks =>
                prevBooks.map(b =>
                    b.id === bookId
                        ? { ...b, available: b.available - 1, is_checked_out_by_user: true }
                        : b
                )
            );
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || 'Failed to checkout book.';
            showNotification({ message: errorMessage, type: 'error' });
            console.error(err);
        } finally {
            (document.getElementById('checkout_modal') as HTMLDialogElement)?.close();
            setSelectedBook(null);
        }
    };

    return (
        <div>
            {notification && (
                <div className="toast toast-top toast-end z-[9999]">
                    <div className={`alert ${notification.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                        <span>{notification.message}</span>
                    </div>
                </div>
            )}
            <h1 className="text-2xl font-bold mb-4">Available Books</h1>
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
                                    <th>Available</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.length > 0 ? (
                                    books.map(book => (
                                        <tr key={book.id} className="hover">
                                            <td>{book.title}</td>
                                            <td>{book.author}</td>
                                            <td>{book.available ?? 0}</td>                                        
                                            <td>
                                                <button
                                                    onClick={() => {
                                                        setSelectedBook(book);
                                                        (document.getElementById('checkout_modal') as HTMLDialogElement)?.showModal();
                                                    }}
                                                    className="btn btn-primary btn-sm"
                                                    disabled={book.available === 0 || book.is_checked_out_by_user}
                                                >
                                                    {book.is_checked_out_by_user ? 'Checked Out' : 'Checkout'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center">
                                            {searchTerm ? 'No matching books found.' : 'No books are available for checkout.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-4">
                            <div className="join">
                                <button className="join-item btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>«</button>
                                <button className="join-item btn btn-disabled">Page {currentPage} of {totalPages}</button>
                                <button className="join-item btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>»</button>
                            </div>
                        </div>
                    )}
                </>
            )}

            <dialog id="checkout_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Confirm Checkout</h3>
                    <p className="py-4">Are you sure you want to checkout "<strong>{selectedBook?.title}</strong>"? ({selectedBook?.available ?? 0} available)</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn mr-2" onClick={() => setSelectedBook(null)}>Cancel</button>
                        </form>
                        <button onClick={() => handleCheckout(selectedBook!.id)} className="btn btn-primary">Confirm</button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default AvailableBooks;