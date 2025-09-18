# Deployment Configuration

## Environment Variables

For the frontend to work correctly, you need to set the following environment variable:

### For Vercel Deployment:
1. In your Vercel dashboard, go to your project settings
2. Navigate to "Environment Variables"
3. Add: `VITE_API_BASE_URL` with value: `https://diksushi-pdfhub.onrender.com/api`

### For Local Development:
1. Copy `.env.example` to `.env.local`
2. Update `VITE_API_BASE_URL` to point to your local backend: `http://localhost:5000/api`

## Deployment Steps for Vercel:

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard:
   - `VITE_API_BASE_URL=https://diksushi-pdfhub.onrender.com/api`
3. **Deploy** - Vercel will automatically:
   - Install dependencies with `npm install`
   - Build the project with `npm run build`
   - Serve the static files

## Configuration Files:

- `vercel.json` - Handles SPA routing and security headers
- `_redirects` - Fallback for client-side routing
- `.env.example` - Template for environment variables
- `.env.local` - Your local environment (not committed to git)

## Troubleshooting:

If you get API errors after deployment:
1. Check that `VITE_API_BASE_URL` is correctly set in Vercel
2. Ensure your backend allows CORS from your Vercel domain
3. Verify the backend is running and accessible at the specified URL