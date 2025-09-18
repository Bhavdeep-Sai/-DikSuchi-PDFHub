const Pdf = require('../models/Pdf');

// Get all PDFs
exports.getAllPdfs = async (req, res) => {
    try {
        const pdfs = await Pdf.find().sort({ uploadedAt: -1 });
        res.status(200).json({ success: true, pdfs });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get Trending PDFs
exports.getTrendingPdfs = async (req, res) => {
    try {
        const pdfs = await Pdf.find({ isTrending: true }).sort({ uploadedAt: -1 });
        res.status(200).json({ success: true, pdfs });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get PDF by ID
exports.getPdfById = async (req, res) => {
    try {
        const pdf = await Pdf.findById(req.params.id);
        if (!pdf) return res.status(404).json({ success: false, message: 'PDF not found' });

        res.status(200).json({ success: true, pdf });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Search PDFs by query (title, category, tags)
exports.searchPdfs = async (req, res) => {
    try {
        const { q } = req.query;

        const pdfs = await Pdf.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { category: { $regex: q, $options: 'i' } },
                { tags: { $regex: q, $options: 'i' } },
            ],
        }).sort({ uploadedAt: -1 });

        res.status(200).json({ success: true, pdfs });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Rate PDF (1 to 5 stars)
exports.ratePdf = async (req, res) => {
    try {
        const pdf = await Pdf.findById(req.params.id);
        if (!pdf) return res.status(404).json({ success: false, message: 'PDF not found' });

        const rating = Number(req.body.rating);
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
        }

        pdf.ratings.push(rating);
        await pdf.save();

        res.status(200).json({ success: true, pdf });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Review PDF (No login required)
exports.reviewPdf = async (req, res) => {
    try {
        const pdf = await Pdf.findById(req.params.id);
        if (!pdf) return res.status(404).json({ success: false, message: 'PDF not found' });

        const comment = req.body.comment;
        if (!comment || comment.trim() === '') {
            return res.status(400).json({ success: false, message: 'Review comment cannot be empty' });
        }

        pdf.reviews.push({ comment });
        await pdf.save();

        res.status(200).json({ success: true, pdf });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// View PDF in browser (redirect to link)
exports.viewPdf = async (req, res) => {
    try {
        const pdf = await Pdf.findById(req.params.id);
        if (!pdf) return res.status(404).json({ success: false, message: 'PDF not found' });

        // If the PDF link is from Google Drive, convert to direct view link
        let fileUrl = pdf.fileUrl;
        if (fileUrl.includes('drive.google.com')) {
            const match = fileUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (match && match[1]) {
                fileUrl = `https://drive.google.com/uc?export=view&id=${match[1]}`;
            }
        }

        res.redirect(fileUrl); // Redirect user to the PDF view link
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Download PDF (redirect to link)
exports.downloadPdf = async (req, res) => {
    try {
        const pdf = await Pdf.findById(req.params.id);
        if (!pdf) return res.status(404).json({ success: false, message: 'PDF not found' });

        // If the PDF link is from Google Drive, convert to direct download link
        let fileUrl = pdf.fileUrl;
        if (fileUrl.includes('drive.google.com')) {
            const match = fileUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (match && match[1]) {
                fileUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`;
            }
        }

        res.redirect(fileUrl); // Redirect user to download link
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
