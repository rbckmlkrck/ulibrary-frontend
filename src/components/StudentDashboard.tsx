/**
 * src/components/StudentDashboard.tsx
 *
 * This file is part of the University Library project.
 * It defines the StudentDashboard component, which serves as the main
 * interface for students to interact with the library system.
 *
 * Author: Raul Berrios
 */
import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import BookList from './BookList';

/** Represents a book's details from a student's perspective. */
interface Book {
    id: number;
    title: string;
    author: string;
    published_year: number;
    genre: string;
}

/** Represents a checkout record belonging to the current student. */
interface MyCheckout {
    id: number;
    book: Book;
    checkout_date: string;
}

/**
 * The main dashboard for users with the 'student' role.
 *
 * This component displays two main sections:
 * 1. A list of available books for checkout, rendered by the `BookList` component.
 * 2. A list of books currently checked out by the logged-in student.
 *
 * It manages fetching the student's checkout data and provides a callback
 * to the `BookList` to refresh this data when a new book is checked out.
 */
const StudentDashboard: React.FC = () => {
    const [myCheckouts, setMyCheckouts] = useState<MyCheckout[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetches the list of books currently checked out by the logged-in student.
     * This function is wrapped in `useCallback` to ensure it has a stable
     * reference, allowing it to be passed as a prop to child components like
     * `BookList` without causing unnecessary re-renders.
     */
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

    // Fetch the student's checkouts when the component first mounts. The
    // `fetchMyCheckouts` function is included as a dependency.
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