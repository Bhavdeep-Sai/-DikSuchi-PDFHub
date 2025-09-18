// src/components/AdminLoginForm.jsx
import React, { useState } from 'react';
import { adminLoginApi } from '../api/pdfApi';

const AdminLoginForm = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        try {
            setLoading(true);
            const data = await adminLoginApi({ email, password });

            // Save token to localStorage for future API requests
            localStorage.setItem('adminToken', data.token);

            setLoading(false);
            if (onLoginSuccess) onLoginSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-[#1E2A47] rounded-2xl p-6 shadow-lg mt-10">
            <h2 className="text-white font-poppins text-2xl font-bold mb-4 text-center">
                Admin Login
            </h2>

            {error && <p className="text-red-400 text-sm mb-2 text-center">{error}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="p-3 rounded-lg bg-[#0F1B2B] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="p-3 rounded-lg bg-[#0F1B2B] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#3B82F6] text-white py-3 rounded-lg hover:bg-[#60a5fa] transition-colors disabled:opacity-50 font-semibold"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default AdminLoginForm;
