import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import LibrarianDashboard from './components/LibrarianDashboard';
import './App.css';

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