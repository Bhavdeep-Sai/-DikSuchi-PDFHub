const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    category: String,
    tags: [String],
    fileUrl: { type: String, required: true }, // PDF link (Google Drive, Dropbox, etc.)
    thumbnail: String, // Cloudinary thumbnail URL
    isTrending: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now },
    ratings: [Number],
    reviews: [{ comment: String, date: { type: Date, default: Date.now } }],
});

module.exports = mongoose.model('Pdf', pdfSchema);
