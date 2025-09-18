const cloudinary = require('../config/cloudinaryConfig');
const Pdf = require('../models/Pdf');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Admin registration (first-time setup)
exports.registerAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: 'Admin already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({ email, password: hashedPassword });
        await newAdmin.save();

        res.status(201).json({ success: true, message: 'Admin registered successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Admin login with JWT
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ success: true, token, admin: { email: admin.email, id: admin._id } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Middleware to protect routes
exports.protect = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    token = token.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.adminId = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Token invalid or expired' });
    }
};

// Upload PDF link (admin-protected)
exports.uploadPdf = async (req, res) => {
    try {
        const { title, description, category, tags, pdfLink } = req.body;

        if (!pdfLink) return res.status(400).json({ success: false, message: 'PDF download link is required' });

        let thumbnailUrl = '';
        if (req.file) {
            // Upload thumbnail to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, { folder: 'pdf-thumbnails' });
            thumbnailUrl = result.secure_url;
            fs.unlinkSync(req.file.path);
        }

        const newPdf = new Pdf({
            title,
            description,
            category,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            fileUrl: pdfLink,  // <-- Save the PDF link instead of uploading PDF
            thumbnail: thumbnailUrl,
            isTrending: false,
        });

        await newPdf.save();
        res.status(201).json({ success: true, pdf: newPdf });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Edit PDF details (admin-protected)
exports.editPdf = async (req, res) => {
    try {
        const { title, description, category, tags, isTrending, pdfLink } = req.body;
        const pdf = await Pdf.findById(req.params.id);
        if (!pdf) return res.status(404).json({ success: false, message: 'PDF not found' });

        if (title) pdf.title = title;
        if (description) pdf.description = description;
        if (category) pdf.category = category;
        if (tags) pdf.tags = tags.split(',').map(tag => tag.trim());
        if (isTrending !== undefined) pdf.isTrending = isTrending;
        if (pdfLink) pdf.fileUrl = pdfLink;

        if (req.file) {
            // Upload new thumbnail to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, { folder: 'pdf-thumbnails' });
            pdf.thumbnail = result.secure_url;
            fs.unlinkSync(req.file.path);
        }

        await pdf.save();
        res.status(200).json({ success: true, pdf });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Delete PDF (admin-protected)
exports.deletePdf = async (req, res) => {
    try {
        const pdf = await Pdf.findById(req.params.id);
        if (!pdf) return res.status(404).json({ success: false, message: 'PDF not found' });

        await Pdf.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'PDF deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Set trending (admin-protected)
exports.setTrending = async (req, res) => {
    try {
        const pdf = await Pdf.findById(req.params.id);
        if (!pdf) return res.status(404).json({ success: false, message: 'PDF not found' });

        pdf.isTrending = req.body.isTrending;
        await pdf.save();

        res.status(200).json({ success: true, pdf });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
