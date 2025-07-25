/**
 * src/App.tsx
 *
 * This file is part of the University Library project.
 * It defines the main application component, orchestrating the overall layout,
 * routing, and authentication-based content display.
 *
 * Author: Raul Berrios
 */
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import LibrarianDashboard from './components/LibrarianDashboard';
import './App.css';

/**
 * Renders the main content of the application based on authentication status.
 *
 * If a user is not authenticated, it displays the `Login` component.
 * Once authenticated, it shows the appropriate dashboard (`StudentDashboard` or
 * `LibrarianDashboard`) based on the user's role. It also includes a
 * navigation bar with a welcome message and a logout button.
 *
 * This component must be rendered within an `AuthProvider` to access user context.
 */
const AppContent: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <nav>
        <h1>University Library</h1>
        <div>
          <span>Welcome, {user.first_name || user.username}! ({user.role})</span>
          <button onClick={logout} style={{ marginLeft: '1rem' }}>Logout</button>
        </div>
      </nav>
      <main className="dashboard">
        {user.role === 'student' && <StudentDashboard />}
        {user.role === 'librarian' && <LibrarianDashboard />}
      </main>
    </div>
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
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;