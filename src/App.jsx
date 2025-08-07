import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import BookPage from './pages/BookPage';
import UserPage from './pages/UserPage';
import ReportPage from './pages/ReportPage';
import './style/Global.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    setToken(tokenFromStorage);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm setToken={setToken} />} />

        {token ? (
          <Route path="/crud" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="book" element={<BookPage />} />
            <Route path="user" element={<UserPage />} />
            <Route path="report" element={<ReportPage />} />
          </Route>
        ) : (
          <Route path="/crud/*" element={<Navigate to="/login" />} />
        )}

        <Route path="/" element={<Navigate to={token ? "/crud" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
