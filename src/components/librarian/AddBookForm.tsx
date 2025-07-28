import React, { useState } from 'react';
import api from '../../services/api';

interface AddBookFormProps {
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

const AddBookForm: React.FC<AddBookFormProps> = ({ onSuccess, onError }) => {
    const [newBook, setNewBook] = useState({ title: '', author: '', published_year: '', genre: '', stock: '' });

    const handleAddBook = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/books/', {
                ...newBook,
                published_year: parseInt(newBook.published_year),
                stock: parseInt(newBook.stock)
            });
            onSuccess('Book added successfully!');
            setNewBook({ title: '', author: '', published_year: '', genre: '', stock: '' });
        } catch (err) {
            onError('Failed to add book. Check console for details.');
            console.error(err);
        }
    };

    return (
        <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">Add New Book</h2>
                <form onSubmit={handleAddBook} className="space-y-4">
                    <div className="form-control">
                        <input type="text" placeholder="Title" className="input input-bordered" value={newBook.title} onChange={e => setNewBook({ ...newBook, title: e.target.value })} required />
                    </div>
                    <div className="form-control">
                        <input type="text" placeholder="Author" className="input input-bordered" value={newBook.author} onChange={e => setNewBook({ ...newBook, author: e.target.value })} required />
                    </div>
                    <div className="form-control">
                        <input type="number" placeholder="Published Year" className="input input-bordered" value={newBook.published_year} onChange={e => setNewBook({ ...newBook, published_year: e.target.value })} required />
                    </div>
                    <div className="form-control">
                        <input type="text" placeholder="Genre" className="input input-bordered" value={newBook.genre} onChange={e => setNewBook({ ...newBook, genre: e.target.value })} required />
                    </div>
                    <div className="form-control">
                        <input type="number" placeholder="Stock" className="input input-bordered" value={newBook.stock} onChange={e => setNewBook({ ...newBook, stock: e.target.value })} required />
                    </div>
                    <div className="card-actions justify-end">
                        <button type="submit" className="btn btn-primary">Add Book</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBookForm;