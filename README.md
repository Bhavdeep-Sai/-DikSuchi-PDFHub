# 📚 DikSuchi PDFHub - Educational Resource Platform

![PDFHub Banner](https://img.shields.io/badge/PDFHub-Educational%20Resources-blue?style=for-the-badge&logo=react)

A modern, full-stack web application that provides a comprehensive platform for managing, browsing, and accessing educational PDF resources. Built with React.js and Node.js, featuring an intuitive admin panel and seamless user experience.

## 🌟 Overview

PDFHub is designed to bridge the gap between educational content creators and learners by providing a centralized platform for PDF resource management. Users can effortlessly browse, search, preview, and download educational materials while administrators have full control over content management.

## ✨ Key Features

### 👥 User Features
- **🔍 Advanced Search & Filtering**: Intelligent search with category-based filtering and fuzzy matching
- **� Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **🎯 Smart Category System**: Browse resources by Web Development, Programming, Design, AI/ML, Marketing
- **⭐ Rating & Review System**: Rate PDFs and leave reviews to help other users
- **📖 PDF Preview**: In-browser PDF viewing with detailed information
- **💾 Download Management**: Direct download with Google Drive integration
- **🏷️ Tag-based Discovery**: Explore content through comprehensive tagging system
- **🔥 Trending Content**: Discover popular and trending educational resources

### �️ Admin Features
- **🔐 Secure Authentication**: JWT-based admin authentication system
- **📤 Content Management**: Upload, edit, and delete PDF resources
- **🖼️ Thumbnail Management**: Cloudinary integration for thumbnail generation
- **📊 Content Analytics**: Track and manage trending content
- **🏷️ Metadata Management**: Comprehensive tagging and categorization
- **⚡ Batch Operations**: Efficient bulk content management

## 🚀 Tech Stack

### Frontend
- **React.js 19.1.1** - Modern UI library with hooks
- **React Router DOM 7.8.2** - Client-side routing
- **Tailwind CSS 4.1.13** - Utility-first styling
- **Vite 7.1.2** - Lightning-fast build tool
- **Axios 1.12.0** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 4.21.2** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM 7.8.7
- **JWT** - Secure authentication (jsonwebtoken 9.0.2)
- **Multer 2.0.2** - File upload handling
- **Cloudinary 1.41.3** - Image and video management

### Development Tools
- **ESLint** - Code linting and formatting
- **Nodemon** - Development server auto-restart
- **CORS** - Cross-origin resource sharing
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
DikSuchi-PDFHub/
├── backend/                 # Node.js backend application
│   ├── config/             # Database and Cloudinary configuration
│   │   ├── cloudinaryConfig.js
│   │   └── db.js
│   ├── controllers/        # Business logic controllers
│   │   ├── adminController.js
│   │   └── pdfController.js
│   ├── middlewares/        # Custom middleware functions
│   │   └── errorHandler.js
│   ├── models/            # MongoDB data models
│   │   ├── Admin.js
│   │   └── Pdf.js
│   ├── routes/            # API route definitions
│   │   ├── adminRoutes.js
│   │   └── pdfRoutes.js
│   ├── uploads/           # Temporary file uploads
│   └── server.js          # Main server entry point
│
├── frontend/              # React.js frontend application
│   ├── src/
│   │   ├── api/          # API service functions
│   │   │   └── pdfApi.js
│   │   ├── components/   # Reusable React components
│   │   │   ├── AdminLoginForm.jsx
│   │   │   ├── AdminPdfCard.jsx
│   │   │   ├── AdminUploadForm.jsx
│   │   │   ├── EditPdfModal.jsx
│   │   │   ├── PdfCard.jsx
│   │   │   ├── RatingStars.jsx
│   │   │   └── ReviewForm.jsx
│   │   ├── context/      # React Context for state management
│   │   │   └── PdfContext.jsx
│   │   ├── pages/        # Main application pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminLoginPage.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── PdfDetail.jsx
│   │   │   └── PdfList.jsx
│   │   ├── assets/       # Static assets (images, logos)
│   │   ├── App.jsx       # Main application component
│   │   └── main.jsx      # Application entry point
│   ├── index.html        # HTML template
│   └── vite.config.js    # Vite configuration
│
└── README.md             # Project documentation
```

## 🗄️ Database Schema

### PDF Model
```javascript
{
  title: String (required),          // PDF title
  description: String,               // Detailed description
  category: String,                  // Main category
  tags: [String],                   // Array of tags
  fileUrl: String (required),       // Google Drive/external URL
  thumbnail: String,                // Cloudinary thumbnail URL
  isTrending: Boolean,              // Trending status
  uploadedAt: Date,                 // Upload timestamp
  ratings: [Number],                // User ratings (1-5)
  reviews: [{                       // User reviews
    comment: String,
    date: Date
  }]
}
```

### Admin Model
```javascript
{
  username: String (required, unique),
  password: String (required),       // Hashed with bcrypt
  createdAt: Date
}
```

## 🌐 API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/pdfs` | Fetch all PDFs with optional filtering |
| `GET` | `/api/pdfs/:id` | Get specific PDF details |
| `POST` | `/api/pdfs/:id/rate` | Submit PDF rating |
| `POST` | `/api/pdfs/:id/review` | Submit PDF review |

### Admin Endpoints (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/login` | Admin authentication |
| `POST` | `/api/admin/upload` | Upload new PDF resource |
| `PUT` | `/api/admin/pdf/:id` | Update PDF details |
| `DELETE` | `/api/admin/pdf/:id` | Delete PDF resource |
| `GET` | `/api/admin/pdfs` | Get all PDFs for admin panel |

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account for image management

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bhavdeep-Sai/-DikSuchi-PDFHub.git
   cd DikSuchi-PDFHub
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create `.env` file in the backend directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=5000
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on `http://localhost:5000`

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

### Building for Production

```bash
# Frontend build
cd frontend
npm run build

# Backend production
cd backend
npm start
```

## 🎨 Features in Detail

### Smart Search & Filtering
- **Fuzzy Matching**: Intelligent search that finds relevant content even with typos
- **Category-based Filtering**: Filter by Web Development, Programming, Design, AI/ML, Marketing
- **Tag-based Discovery**: Comprehensive tagging system for precise content discovery
- **Real-time Search**: Instant search results as you type

### Admin Dashboard
- **Secure Authentication**: JWT-based login system
- **Content Management**: Full CRUD operations for PDF resources
- **Thumbnail Generation**: Automatic thumbnail creation via Cloudinary
- **Trending Management**: Mark content as trending or popular
- **Analytics Dashboard**: View content performance and user engagement

### User Experience
- **Responsive Design**: Optimized for all device types
- **Smooth Animations**: Engaging UI with smooth transitions
- **Search Result Highlighting**: Visual feedback for search matches
- **Download Management**: Seamless PDF downloads with progress indication

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- **DikSuchi E-Learning** - Educational content provider
- **React Community** - For the amazing ecosystem
- **Cloudinary** - For image and video management services
- **MongoDB** - For flexible database solutions

## 📞 Support

For support, email support@diksuchi.com or join our [WhatsApp Channel](https://whatsapp.com/channel/0029Vb6XokJG8l5Mw97gst0Q).

---

<div align="center">

**[⭐ Star this repo](https://github.com/Bhavdeep-Sai/-DikSuchi-PDFHub) • [🐛 Report Bug](https://github.com/Bhavdeep-Sai/-DikSuchi-PDFHub/issues) • [✨ Request Feature](https://github.com/Bhavdeep-Sai/-DikSuchi-PDFHub/issues)**

Made with ❤️ by [DikSuchi Team](https://www.youtube.com/@DiksuchiELearning)

</div>
