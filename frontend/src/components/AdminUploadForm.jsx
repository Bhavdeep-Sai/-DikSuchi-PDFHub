// src/components/AdminUploadForm.jsx
import React, { useState } from 'react';
import { uploadPdfApi } from '../api/pdfApi';

const AdminUploadForm = ({ onUploadSuccess }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [pdfLink, setPdfLink] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!title || !pdfLink) {
            setError('Title and PDF link are required');
            return;
        }

        const token = localStorage.getItem('adminToken');
        if (!token) {
            setError('Admin not authenticated');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('category', category);
            formData.append('tags', tags);
            formData.append('pdfLink', pdfLink);
            if (thumbnail) formData.append('thumbnail', thumbnail);

            await uploadPdfApi(formData, token);

            setLoading(false);
            setSuccessMsg('PDF uploaded successfully!');
            setTitle('');
            setDescription('');
            setCategory('');
            setTags('');
            setPdfLink('');
            setThumbnail(null);

            if (onUploadSuccess) onUploadSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload PDF');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-[#1E2A47] rounded-2xl p-6 shadow-lg mt-6">
            <h2 className="text-white text-2xl font-poppins font-bold mb-4 text-center">
                Upload PDF
            </h2>

            {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
            {successMsg && <p className="text-green-400 text-sm mb-2">{successMsg}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title *"
                    className="p-3 rounded-lg bg-[#0F1B2B] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />

                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className="p-3 rounded-lg bg-[#0F1B2B] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />

                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category"
                    className="p-3 rounded-lg bg-[#0F1B2B] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />

                <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Tags (comma separated)"
                    className="p-3 rounded-lg bg-[#0F1B2B] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />

                <input
                    type="text"
                    value={pdfLink}
                    onChange={(e) => setPdfLink(e.target.value)}
                    placeholder="PDF Link (Google Drive or other) *"
                    className="p-3 rounded-lg bg-[#0F1B2B] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnail(e.target.files[0])}
                    className="text-white"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#3B82F6] text-white py-3 rounded-lg hover:bg-[#60a5fa] transition-colors disabled:opacity-50 font-semibold"
                >
                    {loading ? 'Uploading...' : 'Upload PDF'}
                </button>
            </form>
        </div>
    );
};

export default AdminUploadForm;
