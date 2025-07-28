/**
 * src/App.tsx
 *
 * This file is part of the University Library project. It defines the main
 * application component, orchestrating the overall layout, routing, and
 * authentication-based content display.
 *
 * Author: Raul Berrios
 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './components/Login';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Librarian Pages
import ActiveCheckouts from './pages/librarian/ActiveCheckouts';
import BookInventory from './pages/librarian/BookInventory';
import Management from './pages/librarian/Management';

// Student Pages
import AvailableBooks from './pages/student/AvailableBooks';
import MyCheckouts from './pages/student/MyCheckouts';

/**
 * Defines the application's routes and handles rendering based on
 * authentication state and user role.
 */
const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {user?.role === 'librarian' ? (
          <>
            <Route index element={<Navigate to="checkouts" replace />} />
            <Route path="checkouts" element={<ActiveCheckouts />} />
            <Route path="inventory" element={<BookInventory />} />
            <Route path="management" element={<Management />} />
          </>
        ) : (
          <>
            <Route index element={<Navigate to="books" replace />} />
            <Route path="books" element={<AvailableBooks />} />
            <Route path="my-checkouts" element={<MyCheckouts />} />
          </>
        )}
      </Route>
      {/* Redirect any unknown paths to the appropriate starting page */}
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
};

/**
 * The root component for the University Library application.
 *
 * It sets up the application's routing using `BrowserRouter` and wraps the
 * entire application with the `AuthProvider` to provide authentication state
 * to all child components.
 */
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;