function getWorkingBaseUrl() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // When running on localhost:5000 unified host, relative origin connects directly with 0ms overhead
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
