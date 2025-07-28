import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNotification } from '../../hooks/useNotification';

interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
}

interface Book {
    id: number;
    title: string;
    author: string;
}

interface Checkout {
    id: number;
    student: User;
    book: Book;
    checkout_date: string;
}

interface PaginatedCheckoutResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Checkout[];
}

const PAGE_SIZE = 100;

const ActiveCheckouts: React.FC = () => {
    const [checkouts, setCheckouts] = useState<Checkout[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [selectedCheckout, setSelectedCheckout] = useState<Checkout | null>(null);
    const { notification, showNotification } = useNotification();


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
        const fetchCheckouts = async () => {
            try {
                setLoading(true);
                const response = await api.get<PaginatedCheckoutResponse>(
                    `/checkouts/?search=${debouncedSearchTerm}&page=${currentPage}&page_size=${PAGE_SIZE}`
                );
                setCheckouts(response.data?.results || []);
                setTotalPages(Math.ceil((response.data?.count || 0) / PAGE_SIZE));
                setError(null);
            } catch (err) {
                setError('Failed to fetch checkout books data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCheckouts();
    }, [debouncedSearchTerm, currentPage]);

    const handleReturnBook = async (checkoutId: number) => {
        if (!checkoutId) return;
        try {
            await api.post(`/checkouts/${checkoutId}/return_book/`);
            showNotification({ message: 'Book returned successfully!', type: 'success' });
            setCheckouts(prevCheckouts => prevCheckouts.filter(checkout => checkout.id !== checkoutId));
        } catch (err) {
            showNotification({ message: 'Failed to return book.', type: 'error' });
            console.error(err);
        } finally {
            (document.getElementById('return_modal') as HTMLDialogElement)?.close();
            setSelectedCheckout(null);
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
            <h1 className="text-2xl font-bold mb-4">Active Checkouts</h1>
            <div className="form-control mb-4">
                <input
                    type="text"
                    placeholder="Search by student name/username or book title..."
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
                                    <th>Book Title</th>
                                    <th>Student</th>
                                    <th>Checkout Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {checkouts.length > 0 ? (
                                    checkouts.map(checkout => (
                                        <tr key={checkout.id} className="hover">
                                            <td>{checkout.book.title} by {checkout.book.author}</td>
                                            <td>{checkout.student.first_name} {checkout.student.last_name} ({checkout.student.username})</td>
                                            <td>{new Date(checkout.checkout_date).toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                    onClick={() => {
                                                        (document.getElementById('return_modal') as HTMLDialogElement)?.showModal();
                                                        setSelectedCheckout(checkout);
                                                    }}
                                                    className="btn btn-primary btn-sm">
                                                    Return
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center">{searchTerm ? 'No matching checkouts found.' : 'No books are currently checked out.'}</td>
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
                                    Previous
                                </button>
                                <span className="join-item btn disabled">{currentPage} / {totalPages}</span>
                                <button
                                    className="join-item btn"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>

            )}

            {/* Return Confirmation Modal */}
            <dialog id="return_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Confirm Return</h3>
                    <p className="py-4">
                        Are you sure you want to mark "<strong>{selectedCheckout?.book.title}</strong>" as returned by <strong>{selectedCheckout?.student.first_name} {selectedCheckout?.student.last_name}</strong>?
                    </p>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* The form method="dialog" will close the modal on button click */}
                            <button className="btn mr-2" onClick={() => setSelectedCheckout(null)}>Cancel</button>
                            <button onClick={() => handleReturnBook(selectedCheckout!.id)} className="btn btn-primary">Confirm</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default ActiveCheckouts;