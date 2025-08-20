# BrieflyAI - React Application with Express Backend

This is a React application with an Express backend that provides AI-powered content generation features.

## Issues Fixed

1. **Missing API Endpoints**: Added missing endpoints for different content types:
   - `/api/generate-short-script`
   - `/api/generate-podcast-script` 
   - `/api/generate-youtube-script`

2. **Environment Variables**: Added proper environment variable configuration for both frontend and backend.

3. **Dependencies**: Added missing `dotenv` dependency for environment variable support.

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy the `.env` file and add your OpenRouter API key:
   ```bash
   # In backend/.env
   OPENROUTER_API_KEY=your_actual_api_key_here
   PORT=5000
   ```

4. Get your OpenRouter API key:
   - Go to https://openrouter.ai/keys
   - Create an account and generate an API key
   - Replace `your_openrouter_api_key_here` in the `.env` file

5. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. The frontend is configured to use your deployed backend at `https://brieflyos.onrender.com`

4. Start the frontend development server:
   ```bash
   npm start
   ```

## Deployment

### Backend Deployment (Render)

1. Make sure your backend `.env` file has the correct `OPENROUTER_API_KEY`
2. Deploy to Render and set the environment variable in Render's dashboard
3. Your backend should be accessible at `https://brieflyos.onrender.com`

### Frontend Deployment

1. The frontend is configured to use the deployed backend URL
2. Build the frontend:
   ```bash
   npm run build
   ```
3. Deploy the build folder to your hosting service

## API Endpoints

- `POST /api/generate-article` - Generate a research summary and article
- `POST /api/generate-short-script` - Generate short video script
- `POST /api/generate-podcast-script` - Generate podcast script  
- `POST /api/generate-youtube-script` - Generate YouTube script
- `GET /api/history` - Get content history
- `POST /api/history` - Save content to history
- Other CRM and blog post endpoints...

## Troubleshooting

### 500 Error Issues
- Make sure `OPENROUTER_API_KEY` is set correctly in your backend environment
- Verify the backend server is running and accessible
- Check that all required API endpoints exist in `routes.js`

### CORS Issues
- The backend is configured to allow all origins with `cors()`
- Make sure the frontend is using the correct backend URL

### Environment Variables
- Frontend: Use `REACT_APP_` prefix for environment variables
- Backend: Regular environment variable names work with `dotenv`
