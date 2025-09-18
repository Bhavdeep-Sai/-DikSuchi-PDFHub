✅ PDF Resources Hub (PDFHub) – Complete Project Overview
🎯 Project Purpose

A modern, interactive web platform where users can browse, preview, rate, review, and download educational PDFs without logging in.
Admin manages PDF uploads and highlights trending/popular PDFs.

🚀 Final MVP Features
🔧 Admin Features

Upload PDFs (drag & drop).

Set metadata: title, description, category, tags.

Mark PDFs as Trending/Popular.

📚 User Features

Browse PDFs by category and tags.

Search PDFs by title/category/tag.

Interactive tag cloud for easy filtering.

Preview PDFs in-browser (via PDF.js).

Download PDFs.

Rate PDFs (⭐ 1–5 stars).

Submit reviews (no login required).

View Trending/Popular PDFs.

Bookmark favorite PDFs (stored in browser LocalStorage).

Dark Mode toggle for better UX.

☁️ Storage Strategy

PDFs stored in Cloudinary (Free Tier).

Metadata stored in MongoDB.

Ratings & reviews stored in MongoDB per PDF.

🧱 Data Models (MongoDB – Mongoose Schema Example)
{
  title: String,
  description: String,
  category: String,
  tags: [String],
  fileUrl: String,
  isTrending: Boolean,
  uploadedAt: Date,
  ratings: [Number], // Array of 1–5 stars
  reviews: [
    { comment: String, date: Date }
  ]
}

⚡ Tech Stack
Layer	Technology
Frontend	React + Tailwind CSS + Shadcn/ui
PDF Preview	PDF.js
State Management	React Context / LocalStorage
Backend	Node.js + Express.js
Database	MongoDB (Mongoose)
File Storage	Cloudinary (Free Plan)
API	RESTful API (Express Routes)
Deployment	Vercel / Render / Heroku / Railway (Optional)
🌐 API Endpoints Overview
Method	Endpoint	Purpose
POST	/api/admin/upload-pdf	Upload PDF and store metadata
GET	/api/pdfs	List all PDFs
GET	/api/pdfs/:id	Get PDF metadata by ID
GET	/api/pdfs/search?q=	Search PDFs by title/category/tag
GET	/api/pdfs/trending	Get trending PDFs
GET	/api/pdfs/download/:id	Download PDF file
POST	/api/pdfs/:id/rate	Add user rating (1–5 stars)
POST	/api/pdfs/:id/review	Add user review (no login)
✅ Future-Proof Design Considerations

Scalable structure for easy addition of future features:

User authentication

Advanced analytics

PWA support (offline mode)

✅ Summary Architecture Diagram
[ Admin ] ---> Upload PDF --> [ Express Backend ] ---> Upload to Cloudinary --> [ MongoDB stores metadata ]
                             |
                             ↓
                        API Endpoints
                             ↓
[ User Frontend ] <-- API --> [ MongoDB / Cloudinary ]
 - Search PDFs
 - Preview PDFs
 - Download PDFs
 - Rate & Review PDFs
 - View Trending PDFs
