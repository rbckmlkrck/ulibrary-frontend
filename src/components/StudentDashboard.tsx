import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import BookList from './BookList';

// Define types to match the backend serializers for a student's view
interface Book {
    id: number;
    title: string;
    author: string;
    published_year: number;
    genre: string;
}

interface MyCheckout {
    id: number;
    book: Book;
    checkout_date: string;
}

const StudentDashboard: React.FC = () => {
    const [myCheckouts, setMyCheckouts] = useState<MyCheckout[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Use useCallback to create a stable function reference for fetching data.
    // This is passed to the BookList component to trigger a refresh.
    const fetchMyCheckouts = useCallback(async () => {
        try {
            setLoading(true);
            // The backend API automatically returns only the checkouts for the logged-in student.
            const response = await api.get('/checkouts/');
            setMyCheckouts(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch your checked out books.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch the student's checkouts when the component first mounts.
    useEffect(() => {
        fetchMyCheckouts();
    }, [fetchMyCheckouts]);

    return (
        <div className="student-dashboard" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <div style={{ flex: 2 }}>
                <h2>Available Books</h2>
                <BookList onBookCheckedOut={fetchMyCheckouts} />
            </div>
            <div style={{ flex: 1 }}>
                <h2>My Checked Out Books</h2>
                {loading && <p>Loading your books...</p>}
                {error && <p className="error-message">{error}</p>}
                {!loading && !error && (
                    myCheckouts.length > 0 ? (
                        <ul className="checkout-list">
                            {myCheckouts.map(checkout => (
                                <li key={checkout.id} className="checkout-item">
                                    <p><strong>{checkout.book.title}</strong></p>
                                    <p>by {checkout.book.author}</p>
                                    <p>Checked Out On: {new Date(checkout.checkout_date).toLocaleDateString()}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>You have no books checked out.</p>
                    )
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;