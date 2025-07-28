import React, { useState, useEffect } from 'react';
import api from '../../services/api';

interface Book {
    id: number;
    title: string;
    author: string;
}

interface MyCheckout {
    id: number;
    book: Book;
    checkout_date: string;
}

interface PaginatedMyCheckoutResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: MyCheckout[];
}

const PAGE_SIZE = 10;

const MyCheckouts: React.FC = () => {
    const [myCheckouts, setMyCheckouts] = useState<MyCheckout[]>([]);
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

    useEffect(() => {
        const fetchMyCheckouts = async () => {
            try {
                setLoading(true);
                const response = await api.get<PaginatedMyCheckoutResponse>(
                    `/checkouts/?search=${debouncedSearchTerm}&page=${currentPage}&page_size=${PAGE_SIZE}`
                );
                setMyCheckouts(response.data?.results || []);
                setTotalPages(Math.ceil((response.data?.count || 0) / PAGE_SIZE));
                setError(null);
            } catch (err) {
                setError('Failed to fetch your checked out books.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyCheckouts();
    }, [debouncedSearchTerm, currentPage]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">My Checked Out Books</h1>

            <div className="form-control mb-4">
                <input
                    type="text"
                    placeholder="Search by title or author..."
                    className="input input-bordered w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading && <div className="flex justify-center"><span className="loading loading-spinner"></span></div>}
            {error && <div className="alert alert-error"><span>{error}</span></div>}

            {!loading && !error && (
                <>
                    {myCheckouts.length > 0 ? (
                        <div className="space-y-4">
                            {myCheckouts.map(checkout => (
                                <div key={checkout.id} className="card bg-base-200 shadow-md">
                                    <div className="card-body">
                                        <h2 className="card-title">{checkout.book.title}</h2>
                                        <p>by {checkout.book.author}</p>
                                        <p className="text-sm text-base-content/70">
                                            Checked Out On: {new Date(checkout.checkout_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center mt-4">
                            {searchTerm ? 'No matching books found.' : 'You have no books checked out.'}
                        </p>
                    )}

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
        </div>
    );
};

export default MyCheckouts;