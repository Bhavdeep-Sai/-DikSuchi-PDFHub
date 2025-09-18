// src/pages/PdfDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPdfById } from '../api/pdfApi';
import RatingStars from '../components/RatingStars';
import ReviewForm from '../components/ReviewForm';

const PdfDetail = () => {
    const { id } = useParams();
    const [pdf, setPdf] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPdf = async () => {
        try {
            setLoading(true);
            const data = await getPdfById(id);
            setPdf(data.pdf);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch PDF');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPdf();
    }, [id]);

    if (loading)
        return <p className="text-white text-center mt-10">Loading PDF details...</p>;

    if (error)
        return <p className="text-red-400 text-center mt-10">{error}</p>;

    if (!pdf) return null;

    const avgRating =
        pdf.ratings && pdf.ratings.length > 0
            ? (pdf.ratings.reduce((a, b) => a + b, 0) / pdf.ratings.length).toFixed(1)
            : 0;

    return (
        <div className="min-h-screen bg-[#0F1B2B] p-6">
            <div className="max-w-4xl mx-auto bg-[#1E2A47] rounded-2xl p-6 shadow-lg">
                {/* Thumbnail */}
                {pdf.thumbnail && (
                    <img
                        src={pdf.thumbnail}
                        alt={pdf.title}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                )}

                {/* Title & Description */}
                <h1 className="text-white font-poppins text-3xl font-bold mb-2">
                    {pdf.title}
                </h1>
                {pdf.description && (
                    <p className="text-gray-300 mb-2">{pdf.description}</p>
                )}

                {/* Category & Tags */}
                <p className="text-gray-400 mb-2">Category: {pdf.category || 'N/A'}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                    {pdf.tags?.map((tag, idx) => (
                        <span
                            key={idx}
                            className="text-xs bg-[#3B82F6] text-white px-2 py-1 rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                    <RatingStars rating={avgRating} />
                    <span className="text-gray-300">{avgRating} / 5</span>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mb-6">
                    <a
                        href={pdf.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#3B82F6] text-white px-4 py-2 rounded-lg hover:bg-[#60a5fa] transition-colors"
                    >
                        Download PDF
                    </a>
                    <a
                        href={`/pdf/view/${pdf._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-[#1E2A47] px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        View in Browser
                    </a>
                </div>

                {/* Reviews */}
                <div className="mb-4">
                    <h2 className="text-white text-xl font-semibold mb-2">Reviews</h2>
                    {pdf.reviews && pdf.reviews.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {pdf.reviews.map((rev, idx) => (
                                <div
                                    key={idx}
                                    className="bg-[#0F1B2B] p-3 rounded-lg border border-gray-600"
                                >
                                    <p className="text-gray-300">{rev.comment}</p>
                                    <span className="text-gray-500 text-xs">
                                        {new Date(rev.date).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-300">No reviews yet.</p>
                    )}
                </div>

                {/* Review Form */}
                <ReviewForm
                    pdfId={pdf._id}
                    onReviewSubmitted={fetchPdf} // refresh reviews after submission
                />
            </div>
        </div>
    );
};

export default PdfDetail;
