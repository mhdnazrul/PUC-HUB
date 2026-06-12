// ১. আপনার Render-এর লাইভ ব্যাকএন্ড URL কনফিগারেশন
const API_BASE_URL = window.location.hostname.includes('localhost')
  ? 'http://localhost:3000/api'
  : 'https://puc-hub-api.onrender.com';

// ২. আপনার তৈরি করা সেই রেট্রি ট্রাই ফাংশন (যেমন ছিল তেমনই আছে)
export async function fetchWithRetry(url, options = {}, retries = 3, backoff = 1000) {
  try {
    const response = await fetch(url, options);
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