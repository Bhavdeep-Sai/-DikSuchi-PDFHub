// src/pages/AdminLoginPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLoginForm from '../components/AdminLoginForm';

const AdminLoginPage = () => {
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        // Redirect to admin dashboard after successful login
        navigate('/admin-dashboard');
    };

    return (
        <div className="min-h-screen bg-[#0F1B2B] flex items-center justify-center">
            <AdminLoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
    );
};

export default AdminLoginPage;
