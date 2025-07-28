/**
 * src/components/Login.tsx
 *
 * This file is part of the University Library project.
 * It defines the Login component, which provides the user interface for
 * authentication.
 *
 * Author: Raul Berrios
 */
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Renders a login form for user authentication.
 *
 * This component captures username and password inputs and uses the `useAuth`
 * context to perform the login operation. It handles loading states and
 * displays error messages for failed login attempts.
 */
const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    /**
     * Handles the form submission event for logging in.
     * @param {React.FormEvent} e - The form submission event.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login(username, password);
            // The AuthContext handles successful login by updating the user state.
            // App.tsx will then re-render to show the appropriate dashboard.
        } catch (err) {
            setError('Invalid username or password. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col">
                <div className="text-center">
                    <h1 className="text-5xl font-bold">ULibrary Login</h1>
                    <p className="py-6">Access your student or librarian dashboard to manage books and checkouts.</p>
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form className="card-body" onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <input type="text" placeholder="username" className="input input-bordered" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="password" placeholder="password" className="input input-bordered" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        {error && (
                            <div role="alert" className="alert alert-error mt-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{error}</span>
                            </div>
                        )}
                        <div className="form-control mt-6">
                            <button className="btn btn-primary" type="submit" disabled={loading}>
                                {loading ? <span className="loading loading-spinner"></span> : 'Login'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;