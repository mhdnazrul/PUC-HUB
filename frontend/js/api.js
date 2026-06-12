// ১. আপনার Render-এর লাইভ ব্যাকএন্ড URL কনফিগারেশন
const API_BASE_URL = window.API_BASE || (
  window.location.hostname.includes('localhost')
    ? 'http://localhost:3000/api/v1'
    : 'https://puc-hub-api.onrender.com/api/v1'
);

// CSRF টোকেন ক্যাশ করে রাখার ভ্যারিয়েবল
let cachedCsrfToken = null;

// CSRF টোকেন এন্ডপয়েন্ট থেকে টোকেন নিয়ে আসার জন্য ফাংশন
export async function ensureCsrfToken() {
  if (cachedCsrfToken) return cachedCsrfToken;
  try {
    const res = await fetch(API_BASE_URL + '/csrf-token', {
      credentials: 'include'
    });
    const data = await res.json();
    cachedCsrfToken = data.csrfToken;
    return cachedCsrfToken;
  } catch (err) {
    console.error('Failed to fetch CSRF token:', err);
    return null;
  }
}

// ২. আপনার তৈরি করা সেই রেট্রি ট্রাই ফাংশন (credentials এবং CSRF অটোমেটিক হ্যান্ডেল সহ)
export async function fetchWithRetry(url, options = {}, retries = 3, backoff = 1000) {
  // সব রিকোয়েস্টে credentials: 'include' সেট করছি যাতে কুকি আদান-প্রদান করা যায়
  options.credentials = 'include';
  options.headers = options.headers || {};

  // POST, PUT, DELETE, PATCH রিকোয়েস্ট হলে CSRF টোকেন যুক্ত করা হচ্ছে
  const method = (options.method || 'GET').toUpperCase();
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const csrfToken = await ensureCsrfToken();
    if (csrfToken) {
      options.headers['X-CSRF-Token'] = csrfToken;
      options.headers['X-XSRF-Token'] = csrfToken; // উভয় ভ্যারিয়েন্টই সাপোর্ট করা হচ্ছে
    }
  }

  try {
    const response = await fetch(url, options);

    // যদি সার্ভার থেকে 403 CSRF এরর আসে, তবে ক্যাশ ক্লিয়ার করে নতুন করে টোকেন নিয়ে ট্রাই করবে
    if (response.status === 403 && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      cachedCsrfToken = null; // Clear cache
      const csrfToken = await ensureCsrfToken();
      if (csrfToken) {
        options.headers['X-CSRF-Token'] = csrfToken;
        options.headers['X-XSRF-Token'] = csrfToken;
        return await fetch(url, options);
      }
    }

    if (!response.ok && retries > 0) throw new Error(`HTTP status ${response.status}`);
    return response;
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise(resolve => setTimeout(resolve, backoff));
    return fetchWithRetry(url, options, retries - 1, backoff * 2);
  }
}

// ৩. উদাহরণ: রেজিস্ট্রেশনের জন্য ফাংশন (আপনার এন্ডপয়েন্ট অনুযায়ী নাম মিলিয়ে নেবেন)
export async function registerUser(userData) {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return await response.json();
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}

// ৪. উদাহরণ: লগইনের জন্য ফাংশন
export async function loginUser(credentials) {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return await response.json();
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}