/**
 * src/components/BookList.tsx
 *
 * This file is part of the University Library project.
 * It defines the BookList component, which is responsible for displaying a
 * searchable list of available books, handling book checkouts, and
 * communicating checkout events back to its parent component.
 *
 * Author: Raul Berrios
 */
import React, { useState, useEffect } from 'react';
import { isAxiosError } from 'axios';
import api from '../services/api';

// Define the Book type to match the backend serializer
interface Book {
  id: number;
  title: string;
  author: string;
  published_year: number;
  genre: string;
  stock: number;
}

interface BookListProps {
    // This callback allows the component to notify its parent when a checkout occurs,
    // so the parent can refresh other parts of the UI (like the user's checkout list).
    onBookCheckedOut: () => void;
}

/**
 * Renders a list of available books from the library.
 *
 * This component provides a search input to filter books by title, author, or genre.
 * It fetches book data from the API and allows users to check out a book if it is
 * in stock. When a book is successfully checked out, it invokes the `onBookCheckedOut`
 * callback to notify the parent component.
 *
 * @param {BookListProps} props - The props for the component.
 * @param {() => void} props.onBookCheckedOut - A callback function that is called when a book is successfully checked out.
 */
const BookList: React.FC<BookListProps> = ({ onBookCheckedOut }) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // This effect fetches books from the API whenever the search term changes.
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                // The backend's BookViewSet supports search via a query parameter.
                const response = await api.get(`/books/?search=${searchTerm}`);
                setBooks(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch books. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        // A simple debounce to prevent API calls on every keystroke.
        const timerId = setTimeout(() => {
            fetchBooks();
        }, 300);

        return () => clearTimeout(timerId);
    }, [searchTerm]);

    const handleCheckout = async (bookId: number) => {
        try {
            await api.post('/checkouts/', { book: bookId });
            alert('Book checked out successfully!');
            // Manually update the stock of the checked-out book in the local state
            // to provide immediate feedback to the user without a full refetch.
            setBooks(prevBooks =>
                prevBooks.map(book =>
                    book.id === bookId ? { ...book, stock: book.stock - 1 } : book
                )
            );
            onBookCheckedOut();
        } catch (err) {
            let message = 'Failed to check out book. Please try again.'; // Default message
            // Use the imported isAxiosError type guard
            if (isAxiosError(err) && err.response) {
                const data = err.response.data;
                // The backend provides specific error messages under these keys
                if (data.detail) {
                    message = data.detail;
                } else if (data.non_field_errors && data.non_field_errors[0]) {
                    message = data.non_field_errors[0];
                } else if (data.book && data.book[0]) {
                    message = data.book[0];
                }
            }
            alert(`Error: ${message}`);
            console.error(err);
        }
    };

    return (
        <div className="book-list-container">
            <input
                type="text"
                placeholder="Search by title, author, or genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', marginBottom: '1rem' }}
            />
            {error && <p className="error-message">{error}</p>}
            {loading && <p>Loading books...</p>}
            {!loading && !error && (
                books.length > 0 ? (
                    <ul className="book-list">
                        {books.map((book) => (
                            <li key={book.id} className="book-item">
                                <h4>{book.title} <span style={{color: '#aaa'}}>({book.published_year})</span></h4>
                                <p>by {book.author} | Genre: {book.genre}</p>
                                <p><strong>Available Copies: {book.stock}</strong></p>
                                <button onClick={() => handleCheckout(book.id)} disabled={book.stock === 0}>
                                    {book.stock > 0 ? 'Request Check Out' : 'Out of Stock'}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (<p>{searchTerm ? 'No matching books found.' : 'No books available in the library.'}</p>)
            )}
        </div>
    );
};

export default BookList;
