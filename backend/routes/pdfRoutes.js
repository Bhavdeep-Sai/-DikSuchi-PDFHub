const express = require('express');
const {
    getAllPdfs,
    getTrendingPdfs,
    getPdfById,
    searchPdfs,
    ratePdf,
    reviewPdf,
    viewPdf,
    downloadPdf,
} = require('../controllers/pdfController');

const router = express.Router();

// Get all PDFs (latest first)
router.get('/', getAllPdfs);

// Get trending PDFs
router.get('/trending', getTrendingPdfs);

// Get single PDF by ID
router.get('/:id', getPdfById);

// Search PDFs by query string (?q=searchTerm)
router.get('/search', searchPdfs);

// View PDF in browser (redirect to external link)
router.get('/view/:id', viewPdf);

// Download PDF (redirect to external link)
router.get('/download/:id', downloadPdf);

// Submit a rating (1 to 5 stars)
router.post('/:id/rate', ratePdf);

// Submit a review (no login required)
router.post('/:id/review', reviewPdf);

module.exports = router;
