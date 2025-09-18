// src/pages/PdfList.jsx
import React, { useState } from 'react';
import { usePdf } from '../context/PdfContext';
import PdfCard from '../components/PdfCard';

const PdfList = () => {
    const {
        pdfs,
        trending,
        loading,
        searchResults,
        searchLoading,
        searchPdfByQuery,
    } = usePdf();

    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) searchPdfByQuery(query.trim());
    };

    const displayPdfs =
        query.trim().length > 0 ? searchResults : pdfs;

    return (
        <div className="min-h-screen bg-[#0F1B2B] p-6">
            <h1 className="text-white text-3xl font-bold font-poppins mb-6 text-center">
                PDF Resources
            </h1>

            {/* Search Bar */}
            <form
                onSubmit={handleSearch}
                className="flex max-w-md mx-auto mb-6 gap-2"
            >
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search PDFs..."
                    className="flex-1 p-3 rounded-lg bg-[#1E2A47] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
                <button
                    type="submit"
                    className="bg-[#3B82F6] text-white px-4 py-3 rounded-lg hover:bg-[#60a5fa] transition-colors"
                >
                    Search
                </button>
            </form>

            {/* Trending PDFs */}
            {trending.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-white text-2xl font-semibold mb-4">Trending</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trending.map((pdf) => (
                            <PdfCard key={pdf._id} pdf={pdf} />
                        ))}
                    </div>
                </div>
            )}

            {/* PDF List */}
            <div>
                <h2 className="text-white text-2xl font-semibold mb-4">
                    {query ? 'Search Results' : 'All PDFs'}
                </h2>
                {loading || searchLoading ? (
                    <p className="text-gray-300 text-center">Loading PDFs...</p>
                ) : displayPdfs.length === 0 ? (
                    <p className="text-gray-300 text-center">
                        {query ? 'No results found' : 'No PDFs available'}
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayPdfs.map((pdf) => (
                            <PdfCard key={pdf._id} pdf={pdf} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PdfList;
