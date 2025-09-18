// src/api/pdfApi.js
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// ====================== Public PDF APIs ======================

// Fetch all PDFs
export const fetchPdfs = async () => {
    try {
        const res = await axios.get(`${API_BASE}/pdfs`);
        return res.data;
    } catch (err) {
        console.error('Error fetching PDFs:', err.response?.data || err.message);
        throw err;
    }
};

// Fetch trending PDFs
export const fetchTrendingPdfs = async () => {
    try {
        const res = await axios.get(`${API_BASE}/pdfs/trending`);
        return res.data;
    } catch (err) {
        console.error('Error fetching trending PDFs:', err.response?.data || err.message);
        throw err;
    }
};

// Fetch PDF by ID
export const getPdfById = async (id) => {
    try {
        const res = await axios.get(`${API_BASE}/pdfs/${id}`);
        return res.data;
    } catch (err) {
        console.error('Error fetching PDF:', err.response?.data || err.message);
        throw err;
    }
};

// Search PDFs by query
export const searchPdfs = async (query) => {
    try {
        const res = await axios.get(`${API_BASE}/pdfs/search?q=${query}`);
        return res.data;
    } catch (err) {
        console.error('Error searching PDFs:', err.response?.data || err.message);
        throw err;
    }
};

// View PDF in browser (redirect handled in backend)
export const viewPdf = async (id) => {
    try {
        const res = await axios.get(`${API_BASE}/pdfs/view/${id}`);
        return res.data;
    } catch (err) {
        console.error('Error viewing PDF:', err.response?.data || err.message);
        throw err;
    }
};

// Download PDF (redirect handled in backend)
export const downloadPdf = async (id) => {
    try {
        const res = await axios.get(`${API_BASE}/pdfs/download/${id}`);
        return res.data;
    } catch (err) {
        console.error('Error downloading PDF:', err.response?.data || err.message);
        throw err;
    }
};

// Rate PDF (1-5 stars)
export const ratePdf = async (id, rating) => {
    try {
        const res = await axios.post(`${API_BASE}/pdfs/${id}/rate`, { rating });
        return res.data;
    } catch (err) {
        console.error('Error rating PDF:', err.response?.data || err.message);
        throw err;
    }
};

// Submit a review (no login required)
export const reviewPdf = async (id, comment) => {
    try {
        const res = await axios.post(`${API_BASE}/pdfs/${id}/review`, { comment });
        return res.data;
    } catch (err) {
        console.error('Error submitting review:', err.response?.data || err.message);
        throw err;
    }
};

// ====================== Admin APIs ======================

// Admin login
export const adminLoginApi = async (credentials) => {
    try {
        const res = await axios.post(`${API_BASE}/admin/login`, credentials);
        return res.data;
    } catch (err) {
        console.error('Admin login error:', err.response?.data || err.message);
        throw err;
    }
};

// Upload PDF (link + optional thumbnail)
// `data` should be FormData containing pdfLink and optional thumbnail file
export const uploadPdfApi = async (data, token) => {
    try {
        const res = await axios.post(`${API_BASE}/admin/upload-pdf`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (err) {
        console.error('Error uploading PDF:', err.response?.data || err.message);
        throw err;
    }
};

// Edit PDF (update link, thumbnail, or details)
export const editPdfApi = async (id, data, token) => {
    try {
        const res = await axios.put(`${API_BASE}/admin/edit-pdf/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (err) {
        console.error('Error editing PDF:', err.response?.data || err.message);
        throw err;
    }
};

// Delete PDF
export const deletePdfApi = async (id, token) => {
    try {
        const res = await axios.delete(`${API_BASE}/admin/delete-pdf/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error('Error deleting PDF:', err.response?.data || err.message);
        throw err;
    }
};

// Set PDF trending
export const setTrendingApi = async (id, isTrending, token) => {
    try {
        const res = await axios.post(`${API_BASE}/admin/set-trending/${id}`, { isTrending }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error('Error setting trending:', err.response?.data || err.message);
        throw err;
    }
};
