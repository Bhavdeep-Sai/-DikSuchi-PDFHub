// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PdfProvider } from './context/PdfContext';

// Pages
import Home from './pages/Home';
import PdfList from './pages/PdfList';
import PdfDetail from './pages/PdfDetail';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  return (
    <PdfProvider>
      <Router>
        <div className="min-h-screen bg-[#0F1B2B] font-poppins">
          <Routes>
            {/* Home page */}
            <Route path="/" element={<Home />} />

            {/* User-facing pages */}
            <Route path="/pdf/:id" element={<PdfDetail />} />
            <Route path="/pdfs" element={<PdfList />} />

            {/* Admin pages */}
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />

            {/* Fallback */}
            <Route
              path="*"
              element={
                <div className="text-white text-center mt-10">
                  404 | Page Not Found
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </PdfProvider>
  );
};

export default App;
