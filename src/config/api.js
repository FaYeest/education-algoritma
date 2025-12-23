// API Configuration
// Auto-detect localhost vs production

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:8000'
    : 'https://your-backend-url.com');

export { API_BASE_URL };
