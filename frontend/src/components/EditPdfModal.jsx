// src/components/EditPdfModal.jsx
import React, { useState, useEffect } from 'react';
import { usePdf } from '../context/PdfContext';

const EditPdfModal = ({ pdf, isOpen, onClose, onUpdateSuccess }) => {
    const { updatePdf } = usePdf();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        tags: '',
        pdfLink: '',
        isTrending: false,
    });
    const [thumbnail, setThumbnail] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Categories list
    const categories = ['Web Development', 'Programming', 'Design', 'AI/ML', 'Marketing'];

    // Initialize form data when PDF prop changes
    useEffect(() => {
        if (pdf) {
            setFormData({
                title: pdf.title || '',
                description: pdf.description || '',
                category: pdf.category || '',
                tags: Array.isArray(pdf.tags) ? pdf.tags.join(', ') : '',
                pdfLink: pdf.fileUrl || '',
                isTrending: pdf.isTrending || false,
            });
        }
    }, [pdf]);

    // Get admin token from localStorage
    const getAdminToken = () => {
        return localStorage.getItem('adminToken');
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle thumbnail file change
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file for thumbnail');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Thumbnail file size should be less than 5MB');
                return;
            }
            setThumbnail(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const token = getAdminToken();
        if (!token) {
            alert('Admin authentication required');
            return;
        }

        try {
            setIsSubmitting(true);

            // Create FormData object
            const formDataObj = new FormData();
            formDataObj.append('title', formData.title);
            formDataObj.append('description', formData.description);
            formDataObj.append('category', formData.category);
            formDataObj.append('tags', formData.tags);
            formDataObj.append('pdfLink', formData.pdfLink);
            formDataObj.append('isTrending', formData.isTrending);
            
            // Add thumbnail if selected
            if (thumbnail) {
                formDataObj.append('thumbnail', thumbnail);
            }

            await updatePdf(pdf._id, formDataObj, token);
            
            alert('PDF updated successfully!');
            onUpdateSuccess && onUpdateSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating PDF:', error);
            alert('Error updating PDF: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form and close modal
    const handleClose = () => {
        setThumbnail(null);
        onClose();
    };

    if (!isOpen || !pdf) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Edit PDF
                        </h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            className="w-full text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter PDF title"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter PDF description"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <input
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter PDF description"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                            Tags (Saparated with ',')
                        </label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            className="w-full text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter tags separated by commas"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Separate multiple tags with commas (e.g., react, javascript, frontend)
                        </p>
                    </div>

                    {/* PDF Link */}
                    <div>
                        <label htmlFor="pdfLink" className="block text-sm font-medium text-gray-700 mb-2">
                            PDF Link *
                        </label>
                        <input
                            type="url"
                            id="pdfLink"
                            name="pdfLink"
                            value={formData.pdfLink}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://example.com/path-to-pdf.pdf"
                        />
                    </div>

                    {/* Thumbnail */}
                    <div>
                        <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                            Update Thumbnail (Optional)
                        </label>
                        <input
                            type="file"
                            id="thumbnail"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                            className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Upload a new thumbnail image (JPG, PNG, etc. - Max 5MB)
                        </p>
                        {pdf.thumbnail && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-600 mb-2">Current thumbnail:</p>
                                <img 
                                    src={pdf.thumbnail} 
                                    alt="Current thumbnail" 
                                    className="w-20 h-20 object-cover rounded border"
                                />
                            </div>
                        )}
                    </div>

                    {/* Trending Toggle */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isTrending"
                            name="isTrending"
                            checked={formData.isTrending}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isTrending" className="ml-2 block text-sm text-gray-700">
                            Mark as Trending
                        </label>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Updating...' : 'Update PDF'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPdfModal;