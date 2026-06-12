/**
 * PUC HUB — Frontend API Configuration
 *
 * Single source of truth for the backend API URL.
 * Update PROD_API_URL to your actual Render service URL before deploying.
 */

const PROD_API_URL = 'https://puc-hub-api.onrender.com/api/v1';
const DEV_API_URL  = 'http://localhost:3000/api/v1';

// Automatically use the production URL when running on Vercel,
// and the local URL when running via Live Server (localhost / 127.0.0.1).
const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);

window.API_BASE = isLocal ? DEV_API_URL : PROD_API_URL;
