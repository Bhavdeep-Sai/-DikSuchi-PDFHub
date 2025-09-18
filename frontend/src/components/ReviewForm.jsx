// src/components/ReviewForm.jsx
import React, { useState } from 'react';
import { reviewPdf } from '../api/pdfApi';

const ReviewForm = ({ pdfId, onReviewSubmitted }) => {
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            setError('Review cannot be empty');
            return;
        }

        try {
            setLoading(true);
            await reviewPdf(pdfId, comment);
            setComment('');
            setError('');
            setLoading(false);

            // Callback to refresh reviews in parent
            if (onReviewSubmitted) onReviewSubmitted();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review..."
                className="p-2 rounded-lg bg-[#0F1B2B] text-white border border-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                rows={3}
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="bg-[#3B82F6] text-white px-4 py-2 rounded-lg hover:bg-[#60a5fa] transition-colors disabled:opacity-50"
            >
                {loading ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
};

export default ReviewForm;
