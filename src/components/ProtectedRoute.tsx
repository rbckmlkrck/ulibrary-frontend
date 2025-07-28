import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * A component that protects routes from unauthenticated access.
 *
 * If the user is not authenticated, it redirects them to the login page,
 * preserving the location they were trying to access. If the authentication
 * state is still loading, it displays a loading indicator.
 *
 * @param {{ children: JSX.Element }} props The props for the component.
 * @returns {JSX.Element} The child components if authenticated, or a redirect.
 */
const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><span className="loading loading-lg"></span></div>;
    }

    return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;