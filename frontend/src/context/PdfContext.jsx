// src/context/PdfContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchPdfs, fetchTrendingPdfs, searchPdfs, editPdfApi, deletePdfApi } from '../api/pdfApi';

// Create context
const PdfContext = createContext();

// Provider component
export const PdfProvider = ({ children }) => {
    const [pdfs, setPdfs] = useState([]);
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load all PDFs
    const loadPdfs = async () => {
        try {
            setLoading(true);
            const data = await fetchPdfs();
            setPdfs(data.pdfs);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    // Load trending PDFs
    const loadTrending = async () => {
        try {
            const data = await fetchTrendingPdfs();
            setTrending(data.pdfs);
        } catch (err) {
            console.error('Error loading trending PDFs:', err.response?.data?.message || err.message);
        }
    };

    // Search PDFs by query
    const searchPdfByQuery = async (query) => {
        try {
            setSearchLoading(true);
            const data = await searchPdfs(query);
            setSearchResults(data.pdfs);
            setSearchLoading(false);
        } catch (err) {
            console.error('Error searching PDFs:', err.response?.data?.message || err.message);
            setSearchLoading(false);
        }
    };

    // Clear search results
    const clearSearchResults = () => {
        setSearchResults([]);
    };

    // Update PDF
    const updatePdf = async (id, formData, token) => {
        try {
            setLoading(true);
            const response = await editPdfApi(id, formData, token);
            // Reload PDFs to get updated data
            await loadPdfs();
            setLoading(false);
            return response;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
            throw err;
        }
    };

    // Delete PDF
    const deletePdf = async (id, token) => {
        try {
            setLoading(true);
            const response = await deletePdfApi(id, token);
            // Remove PDF from local state
            setPdfs(prevPdfs => prevPdfs.filter(pdf => pdf._id !== id));
            setTrending(prevTrending => prevTrending.filter(pdf => pdf._id !== id));
            setLoading(false);
            return response;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
            throw err;
        }
    };

    // Load PDFs on mount
    useEffect(() => {
        loadPdfs();
        loadTrending();
    }, []);

    return (
        <PdfContext.Provider
            value={{
                pdfs,
                trending,
                loading,
                error,
                searchResults,
                searchLoading,
                loadPdfs,
                loadTrending,
                searchPdfByQuery,
                clearSearchResults,
                updatePdf,
                deletePdf,
            }}
        >
            {children}
        </PdfContext.Provider>
    );
};

// Named hook for easy usage
export const usePdf = () => useContext(PdfContext);

// Default export (optional, in case needed)
export default PdfContext;
