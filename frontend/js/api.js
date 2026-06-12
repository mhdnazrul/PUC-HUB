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
