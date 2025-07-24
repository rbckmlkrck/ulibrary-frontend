import React, { useState, useEffect } from 'react';
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
        } catch (err: any) {
            // Make error handling user friendly
            const data = err.response?.data;
            let message = 'Failed to check out book. Please try again.'; // Default message

            if (data) {
                //console.log(data);
                message = data.detail || (data.non_field_errors && data.non_field_errors[0]) || (data.book && data.book[0]) || data || message;
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
