import React, { useState } from 'react';

const PdfCard = ({ pdf }) => {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    const handleImageLoad = () => setImageLoading(false);
    const handleImageError = () => {
        setImageLoading(false);
        setImageError(true);
    };

    const handleDownload = async (e) => {
        e.preventDefault();
        if (pdf.fileUrl || pdf.googleDriveUrl) {
            const url = pdf.fileUrl || pdf.googleDriveUrl;
            const filename = pdf.title || 'document.pdf';

            try {
                // For Google Drive URLs, we need to modify them to force download
                let downloadUrl = url;

                // Check if it's a Google Drive URL and convert to direct download format
                if (url.includes('drive.google.com')) {
                    // Extract file ID from various Google Drive URL formats
                    let fileId = '';

                    if (url.includes('/file/d/')) {
                        fileId = url.split('/file/d/')[1].split('/')[0];
                    } else if (url.includes('id=')) {
                        fileId = url.split('id=')[1].split('&')[0];
                    }

                    if (fileId) {
                        // Use Google Drive direct download URL format
                        downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
                    }
                }

                // Create download link
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
                link.style.display = 'none';

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            } catch (error) {
                console.error('Download failed:', error);
                // Fallback: open in new tab if direct download fails
                window.open(url, '_blank');
            }
        }
    };

    const handlePreview = (e) => {
        e.preventDefault();
        if (pdf.fileUrl || pdf.googleDriveUrl) {
            window.open(pdf.fileUrl || pdf.googleDriveUrl, '_blank');
        }
    };

    return (
        <div className="bg-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col group hover:scale-[1.02] hover:-translate-y-1">

            {pdf.thumbnail && !imageError && (
                <div className="relative overflow-hidden">
                    {imageLoading && (
                        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                        </div>
                    )}
                    <img
                        src={pdf.thumbnail}
                        alt={pdf.title}
                        className={`w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        style={{ display: imageLoading ? 'none' : 'block' }}
                    />
                </div>
            )}

            <div className="p-6 flex-1 flex flex-col">

                <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-lg group-hover:text-blue-600 transition-colors">
                    {pdf.title}
                </h3>

                {pdf.description && (
                    <p className="text-gray-600 mb-4 flex-1 text-sm line-clamp-3">
                        {pdf.description}
                    </p>
                )}

                {pdf.tags && pdf.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {pdf.tags.map((tag, idx) => (
                            <span
                                key={idx}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex gap-2 w-full mt-auto">
                    {/* Download Button */}
                    <button
                        onClick={handleDownload}
                        disabled={!pdf.fileUrl && !pdf.googleDriveUrl}
                        className={`flex-1 py-3 px-4 rounded-lg cursor-pointer font-medium transition-all duration-200 shadow-md flex items-center justify-center gap-2 group/btn ${pdf.fileUrl || pdf.googleDriveUrl
                            ? 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-[1.02] hover:shadow-lg'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm font-semibold">Download</span>
                    </button>

                    {/* View Button */}
                    <button 
                        onClick={handlePreview}
                        disabled={!pdf.fileUrl && !pdf.googleDriveUrl}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 shadow-md flex items-center justify-center group/view ${pdf.fileUrl || pdf.googleDriveUrl
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 hover:scale-[1.01] hover:shadow-lg'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        aria-label="View"
                    >
                        <svg 
                            className="w-5 h-5 group-hover/view:scale-102 transition-transform" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" 
                            />
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" 
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PdfCard;