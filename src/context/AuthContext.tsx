/**
 * src/context/AuthContext.tsx
 *
 * This file is part of the University Library project.
 * It defines the authentication context for the application, providing a way
 * to manage user state, authentication tokens, and login/logout functionality
 * across all components.
 *
 * Author: Raul Berrios
 */
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '../services/api';

/**
 * Represents the structure of an authenticated user, matching the backend serializer.
 */
interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: 'student' | 'librarian';
}

/**
 * Defines the shape of the authentication context provided to the application.
 */
interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
}

/**
 * The React context for authentication state.
 * It is initialized as undefined to ensure it is only used within an `AuthProvider`.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * A custom hook to access the authentication context.
 *
 * This hook provides a convenient way to get the `user`, `token`, `login`,
 * `logout`, and `loading` state from anywhere in the component tree that is
 * wrapped by `AuthProvider`.
 *
 * @throws {Error} If used outside of an `AuthProvider`.
 * @returns {AuthContextType} The authentication context value.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * Provides authentication state and functions to its children.
 *
 * This component manages the user's authentication status, including the auth
 * token and user details. It handles the initial authentication check on app
 * load and exposes `login` and `logout` functions.
 *
 * @param {AuthProviderProps} props - The props for the component.
 * @param {ReactNode} props.children - The child components to be rendered within the provider.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true); // To handle initial auth check
    const [error, setError] = useState<string | null>(null);

    // This effect runs on initial load and whenever the token changes.
    // It attempts to authenticate the user if a token is present in local storage.
    useEffect(() => {
        const initializeAuth = async () => {
            if (token) {
                // If a token exists, set it on the API service for subsequent requests
                api.defaults.headers.common['Authorization'] = `Token ${token}`;
                try {
                    // Fetch the user details to verify the token is still valid
                    const response = await api.get('/me/');
                    setUser(response.data);
                } catch (error) {
                    // If the token is invalid, clear it
                    console.error("Invalid token, logging out.", error);
                    localStorage.removeItem('token');
                    setToken(null);
                    delete api.defaults.headers.common['Authorization'];
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, [token]);

    /**
     * Logs in a user with the given credentials.
     * On success, it stores the auth token, sets the user state, and configures
     * the API client with the new token.
     * @param {string} username - The user's username.
     * @param {string} password - The user's password.
     */
    const login = async (username: string, password: string) => {
        setError(null); // Clear previous errors
        try {
            const response = await api.post<{ token: string }>('token-auth/', { username, password });
            const new_token = response.data.token;
            localStorage.setItem('token', new_token);
            setToken(new_token);
            api.defaults.headers.common['Authorization'] = `Token ${new_token}`;
            const userResponse = await api.get('/me/');
            setUser(userResponse.data);
        } catch (err: any) {
            const errorMessage = 
                err.response?.data?.non_field_errors?.[0] || 
                'Login failed. Please check your credentials and try again.';
            console.error("Login failed:", err);
            setError(errorMessage);
            // Re-throw the error so the calling component knows the login failed
            throw new Error(errorMessage);
        }
    };

    /**
     * Logs out the current user.
     * It clears the user state, removes the token from local storage, and
     * removes the authorization header from the API client.
     */
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
    };

    const value = { user, token, login, logout, loading, error };

    // Don't render children until the initial token check is complete
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
