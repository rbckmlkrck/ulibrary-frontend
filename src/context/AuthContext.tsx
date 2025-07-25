import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '../services/api';

// Define the shape of the User object based on the backend serializer
interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: 'student' | 'librarian';
}

// Define the shape of the context value
interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

// Create the context with a default undefined value to prevent usage outside the provider
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook for easy consumption of the context
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

// The provider component that will wrap the application
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true); // To handle initial auth check

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

    // Perform the login logic, setting the token in local storage and fetching the userresponse 
    const login = async (username: string, password: string) => {
        const response = await api.post<{ token: string }>('/token-auth/', { username, password });
        const new_token = response.data.token;
        localStorage.setItem('token', new_token);
        setToken(new_token);
        api.defaults.headers.common['Authorization'] = `Token ${new_token}`;
        const userResponse = await api.get('/me/');
        setUser(userResponse.data);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
    };

    const value = { user, token, login, logout, loading };

    // Don't render children until the initial token check is complete
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
