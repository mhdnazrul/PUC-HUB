/**
 * PUC HUB — Frontend API Configuration
 *
 * Single source of truth for the backend API URL.
 * This script runs first (before any other script) and sets window.API_BASE.
 */

const PROD_API_URL = 'https://puc-hub-api.onrender.com/api/v1';
const DEV_API_URL  = 'http://localhost:3000/api/v1';

// Automatically switch URLs based on where the page is running.
// Vercel hostname: puc-hub-ten.vercel.app
// Local: localhost / 127.0.0.1
const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);

window.API_BASE     = isLocal ? DEV_API_URL : PROD_API_URL;
window.FRONTEND_URL = isLocal ? 'http://localhost:5500' : 'https://puc-hub-ten.vercel.app';
