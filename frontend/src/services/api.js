function getWorkingBaseUrl() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin;
  }
  return "http://127.0.0.1:5000";
}

export async function getHealth() {
  const baseUrl = getWorkingBaseUrl();
  const response = await fetch(`${baseUrl}/health`);
  if (!response.ok) {
    throw new Error("API offline");
  }
  return await response.json();
}

export async function getRecommendations(visitorId, limit = 10, minPrice = null, maxPrice = null) {
  const baseUrl = getWorkingBaseUrl();
  console.log("Fetching recommendations for visitor:", visitorId);

  let url = `${baseUrl}/recommend/${encodeURIComponent(visitorId)}?limit=${limit}`;
  if (minPrice !== null && minPrice !== undefined) url += `&min_price=${minPrice}`;
  if (maxPrice !== null && maxPrice !== undefined) url += `&max_price=${maxPrice}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const err = new Error(error.detail || "Unable to get recommendations");
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  return data;
}

export async function getUserStats(visitorId) {
  const baseUrl = getWorkingBaseUrl();
  const response = await fetch(`${baseUrl}/user/${encodeURIComponent(visitorId)}/stats`);
  if (!response.ok) {
    return null;
  }
  return await response.json();
}

export async function getUserHistory(visitorId) {
  const baseUrl = getWorkingBaseUrl();
  const response = await fetch(`${baseUrl}/user/${encodeURIComponent(visitorId)}/history`);
  if (!response.ok) {
    return null;
  }
  return await response.json();
}

export async function getSampleUser() {
  const baseUrl = getWorkingBaseUrl();
  const response = await fetch(`${baseUrl}/users/sample`);
  if (!response.ok) {
    throw new Error("Failed to fetch sample user");
  }
  return await response.json();
}

export async function recordViewEvent(visitorId, itemId) {
  const baseUrl = getWorkingBaseUrl();
  const response = await fetch(`${baseUrl}/events/view`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      visitor_id: String(visitorId),
      item_id: String(itemId),
      timestamp: Date.now()
    })
  });
  return await response.json();
}

export async function setPricePreference(visitorId, minPrice, maxPrice) {
  const baseUrl = getWorkingBaseUrl();
  const response = await fetch(`${baseUrl}/user/${encodeURIComponent(visitorId)}/price-preference`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ min_price: minPrice, max_price: maxPrice })
  });
  return await response.json();
}

export async function getPricePreference(visitorId) {
  const baseUrl = getWorkingBaseUrl();
  const response = await fetch(`${baseUrl}/user/${encodeURIComponent(visitorId)}/price-preference`);
  if (!response.ok) return null;
  return await response.json();
}

export async function getAllProducts() {
  const baseUrl = getWorkingBaseUrl();
  const response = await fetch(`${baseUrl}/products`);
  if (!response.ok) return { products: [] };
  return await response.json();
}

export async function getModelMetrics() {
  const baseUrl = getWorkingBaseUrl();
  const response = await fetch(`${baseUrl}/api/metrics`);
  if (!response.ok) return null;
  return await response.json();
}

// Authentication APIs
export async function loginUser(email, password) {
  const baseUrl = getWorkingBaseUrl();
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || 'Login failed');
  }

  if (data.token) {
    localStorage.setItem('retailrocket_token', data.token);
    localStorage.setItem('retailrocket_user', JSON.stringify(data.user));
  }
  return data;
}

export async function registerUser(name, email, password, visitor_id) {
  const baseUrl = getWorkingBaseUrl();
  const response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, visitor_id })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || 'Registration failed');
  }

  if (data.token) {
    localStorage.setItem('retailrocket_token', data.token);
    localStorage.setItem('retailrocket_user', JSON.stringify(data.user));
  }
  return data;
}

export async function getDemoCredentials() {
  const baseUrl = getWorkingBaseUrl();
  const response = await fetch(`${baseUrl}/api/auth/demo-credentials`);
  if (!response.ok) return { credentials: [] };
  return await response.json();
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('retailrocket_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function logoutUser() {
  localStorage.removeItem('retailrocket_token');
  localStorage.removeItem('retailrocket_user');
}
