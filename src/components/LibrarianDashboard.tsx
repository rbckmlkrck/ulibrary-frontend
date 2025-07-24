import React, { useState, useEffect } from 'react';
import api from '../services/api';

// Define the necessary types based on the backend serializers
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

const LibrarianDashboard: React.FC = () => {
    const [checkouts, setCheckouts] = useState<Checkout[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // State for the "Add Book" form
    const [newBook, setNewBook] = useState({ title: '', author: '', published_year: '', genre: '', stock: '' });

    // State for the "Add User" form
    const [newUser, setNewUser] = useState({ first_name: '', last_name: '', username: '', email: '', password: '', role: 'student' });

    // This effect fetches checkouts from the API whenever the search term changes.
    useEffect(() => {
        const fetchCheckouts = async () => {
            try {
                setLoading(true);
                // The backend now supports search on the checkouts endpoint.
                const response = await api.get(`/checkouts/?search=${searchTerm}`);
                setCheckouts(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch active checkouts.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const timerId = setTimeout(() => fetchCheckouts(), 300);
        return () => clearTimeout(timerId);
    }, [searchTerm]);

    const handleReturnBook = async (checkoutId: number) => {
        try {
            // The backend has a custom action for returning books.
            await api.post(`/checkouts/${checkoutId}/return_book/`);
            alert('Book returned successfully!');
            // Remove the returned book from the local state for immediate UI feedback.
            setCheckouts(prevCheckouts => prevCheckouts.filter(checkout => checkout.id !== checkoutId));
        } catch (err) {
            alert('Failed to return book.');
            console.error(err);
        }
    };

    const handleAddBook = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/books/', {
                ...newBook,
                published_year: parseInt(newBook.published_year),
                stock: parseInt(newBook.stock)
            });
            alert('Book added successfully!');
            setNewBook({ title: '', author: '', published_year: '', genre: '', stock: '' }); // Reset form
        } catch (err) {
            alert('Failed to add book. Check console for details.');
            console.error(err);
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/users/', newUser);
            alert('User created successfully!');
            setNewUser({ first_name: '', last_name: '', username: '', email: '', password: '', role: 'student' }); // Reset form
        } catch (err) {
            alert('Failed to create user. Check console for details.');
            console.error(err);
        }
    };

    return (
        <div className="librarian-dashboard" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <div style={{ flex: 2 }}>
                <h2>Active Checkouts</h2>
                <input
                    type="text"
                    placeholder="Search by student name/username or book title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', marginBottom: '1rem' }}
                />
                {error && <p className="error-message">{error}</p>}
                {loading && <p>Loading checkouts...</p>}
                {!loading && !error && (
                    checkouts.length > 0 ? (
                    <ul className="checkout-list">
                        {checkouts.map(checkout => (
                            <li key={checkout.id} className="checkout-item">
                                <p><strong>Book:</strong> {checkout.book.title} by {checkout.book.author}</p>
                                <p><strong>Student:</strong> {checkout.student.first_name} {checkout.student.last_name} ({checkout.student.username})</p>
                                <p><strong>Checked Out On:</strong> {new Date(checkout.checkout_date).toLocaleDateString()}</p>
                                <button onClick={() => handleReturnBook(checkout.id)}>Mark as Returned</button>
                            </li>
                        ))}
                    </ul>
                    ) : (
                        <p>{searchTerm ? 'No matching checkouts found.' : 'No books are currently checked out.'}</p>
                    )
                )}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <form onSubmit={handleAddBook} className="form-container">
                    <h2>Add New Book</h2>
                    <div className="form-group">
                        <input type="text" placeholder="Title" value={newBook.title} onChange={e => setNewBook({ ...newBook, title: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <input type="text" placeholder="Author" value={newBook.author} onChange={e => setNewBook({ ...newBook, author: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <input type="number" placeholder="Published Year" value={newBook.published_year} onChange={e => setNewBook({ ...newBook, published_year: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <input type="text" placeholder="Genre" value={newBook.genre} onChange={e => setNewBook({ ...newBook, genre: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <input type="number" placeholder="Stock" value={newBook.stock} onChange={e => setNewBook({ ...newBook, stock: e.target.value })} required />
                    </div>
                    <button type="submit">Add Book</button>
                </form>

                <form onSubmit={handleAddUser} className="form-container">
                    <h2>Add New User</h2>
                     <div className="form-group">
                        <input type="text" placeholder="Username" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <input type="text" placeholder="First Name" value={newUser.first_name} onChange={e => setNewUser({ ...newUser, first_name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <input type="text" placeholder="Last Name" value={newUser.last_name} onChange={e => setNewUser({ ...newUser, last_name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select id="role" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                            <option value="student">Student</option>
                            <option value="librarian">Librarian</option>
                        </select>
                    </div>
                    <button type="submit">Create User</button>
                </form>
            </div>
        </div>
    );
};

export default LibrarianDashboard;