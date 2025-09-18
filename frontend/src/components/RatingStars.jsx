// src/components/RatingStars.jsx
import React from 'react';

const RatingStars = ({ rating, size = "md" }) => {
    const fullStars = Math.floor(rating); // number of filled stars
    const halfStar = rating - fullStars >= 0.5; // check if half star needed
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // remaining empty stars

    const sizeClasses = {
        sm: "w-3.5 h-3.5",
        md: "w-4 h-4",
        lg: "w-5 h-5"
    };

    const starSize = sizeClasses[size] || sizeClasses.md;

    const StarIcon = ({ filled, half = false }) => (
        <svg className={`${starSize} ${filled ? 'text-yellow-400' : 'text-gray-300'} transition-colors`} fill="currentColor" viewBox="0 0 24 24">
            {half ? (
                <defs>
                    <linearGradient id="half-star">
                        <stop offset="50%" stopColor="currentColor" className="text-yellow-400" />
                        <stop offset="50%" stopColor="currentColor" className="text-gray-300" />
                    </linearGradient>
                </defs>
            ) : null}
            <path 
                d="M12 2L13.09 8.26L19.36 7.18L14.18 12.36L15.26 18.64L12 15.82L8.74 18.64L9.82 12.36L4.64 7.18L10.91 8.26L12 2Z"
                fill={half ? "url(#half-star)" : "currentColor"}
            />
        </svg>
    );

    return (
        <div className="flex items-center gap-0.5">
            {/* Full stars */}
            {Array(fullStars)
                .fill(0)
                .map((_, idx) => (
                    <StarIcon key={`full-${idx}`} filled={true} />
                ))}

            {/* Half star */}
            {halfStar && (
                <StarIcon filled={true} half={true} />
            )}

            {/* Empty stars */}
            {Array(emptyStars)
                .fill(0)
                .map((_, idx) => (
                    <StarIcon key={`empty-${idx}`} filled={false} />
                ))}
        </div>
    );
};

export default RatingStars;
