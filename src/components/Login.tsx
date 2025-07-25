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
        <div className="app-container">
            <form onSubmit={handleSubmit} className="form-container">
                <h2>Library Login</h2>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default Login;