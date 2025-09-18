const express = require('express');
const multer = require('multer');
const {
    adminLogin,
    registerAdmin,
    uploadPdf,
    setTrending,
    protect,
    editPdf,
    deletePdf,
} = require('../controllers/adminController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary folder for thumbnail images

// Admin registration (optional, for first setup)
router.post('/register', registerAdmin);

// Admin login
router.post('/login', adminLogin);

// Upload a PDF link (protected by JWT)
// Now expects `pdfLink` in body and optional thumbnail image in 'thumbnail'
router.post('/upload-pdf', protect, upload.single('thumbnail'), uploadPdf);

// Set Trending status for a PDF (protected by JWT)
router.post('/set-trending/:id', protect, setTrending);

// Edit PDF (can update link, thumbnail, or other details)
router.put('/edit-pdf/:id', protect, upload.single('thumbnail'), editPdf);

// Delete PDF
router.delete('/delete-pdf/:id', protect, deletePdf);

module.exports = router;
