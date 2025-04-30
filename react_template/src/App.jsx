// src/App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ThemeProvider from './context/ThemeContext';
import UserProvider from './context/UserContext';
import BookList from './components/BookList';
import BookReader from './components/BookReader';
import LoginForm from './components/LoginForm';
import Bookshelf from './components/Bookshelf';
import UserProfile from './components/UserProfile';
import { isAuthenticated } from './utils/authUtils';
import AdminPanel from './components/AdminPanel';

// Protected route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  // Application state
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <Router>
      <ThemeProvider>
        <UserProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<BookList searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
            <Route path="/book/:id" element={<BookReader />} />
            <Route path="/login" element={<LoginForm />} />
            
            {/* Protected routes */}
            <Route path="/bookshelf" element={
              <ProtectedRoute>
                <Bookshelf />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </UserProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;