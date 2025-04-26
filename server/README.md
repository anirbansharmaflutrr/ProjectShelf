# ProjectShelf Server

Backend for ProjectShelf - Portfolio & Case Study Generator

## Setup Instructions

### Environment Variables

Create a `.env` file in the server root directory based on the following template:

```
# Server Configuration
PORT=8080
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/projectshelf

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Client URL
CLIENT_URL=http://localhost:5173

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Setting Up Google OAuth

To enable Google login, you need to set up OAuth 2.0 credentials in Google Cloud Console:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or use an existing one
3. In the sidebar, go to "APIs & Services" > "OAuth consent screen"
   - Set up your app information and scopes (basic profile and email are sufficient)
4. In the sidebar, go to "APIs & Services" > "Credentials"
5. Click "Create Credentials" > "OAuth client ID"
6. Select "Web application" for the application type
7. Add authorized JavaScript origins:
   - `http://localhost:5173` (for local development)
   - `http://localhost:8080` (for local API server)
   - Add your production URLs when ready
8. Add authorized redirect URIs:
   - `http://localhost:8080/api/auth/google/callback` (for local development)
   - Add your production callback URL when ready
9. Click "Create" and note the generated Client ID and Client Secret
10. Add these credentials to your `.env` file as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

### Running the Server

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The server will start on the port specified in your `.env` file (default: 8080).
