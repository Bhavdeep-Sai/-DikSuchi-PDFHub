// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import AdminUploadForm from '../components/AdminUploadForm';
import AdminPdfCard from '../components/AdminPdfCard';
import { usePdf } from '../context/PdfContext';

const AdminDashboard = () => {
    const { pdfs, loadPdfs, loading } = usePdf();
    const [refreshKey, setRefreshKey] = useState(0);

    // Refresh PDFs after upload or update
    const handleUploadSuccess = () => {
        loadPdfs();
        setRefreshKey((prev) => prev + 1); // force re-render
    };

    const handleUpdateSuccess = () => {
        loadPdfs();
        setRefreshKey((prev) => prev + 1); // force re-render
    };

    return (
        <div className="min-h-screen bg-[#0F1B2B] p-6">
            <h1 className="text-white font-poppins text-3xl font-bold mb-6 text-center">
                Admin Dashboard
            </h1>

            {/* Upload Form */}
            <AdminUploadForm onUploadSuccess={handleUploadSuccess} />

            {/* PDFs List */}
            <div className="mt-10">
                <h2 className="text-white text-2xl font-semibold mb-4">All PDFs</h2>
                {loading ? (
                    <p className="text-gray-300 text-center">Loading PDFs...</p>
                ) : pdfs.length === 0 ? (
                    <p className="text-gray-300 text-center">No PDFs available</p>
                ) : (
                    <div
                        key={refreshKey} // force re-render after upload
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {pdfs.map((pdf) => (
                            <AdminPdfCard 
                                key={pdf._id} 
                                pdf={pdf} 
                                onUpdateSuccess={handleUpdateSuccess}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
