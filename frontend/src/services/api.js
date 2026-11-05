const PORTS = [5000, 8000, 8088, 8085, 8082, 8001];
let cachedWorkingPort = null;

async function getWorkingBaseUrl() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (cachedWorkingPort) {
    return `http://127.0.0.1:${cachedWorkingPort}`;
  }

  for (const port of PORTS) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/health`, { signal: AbortSignal.timeout(1200) });
      if (res.ok) {
        cachedWorkingPort = port;
        return `http://127.0.0.1:${port}`;
      }
    } catch {
      // try next port
    }
  }

  return "http://127.0.0.1:5000";
}

export async function getHealth() {
  const baseUrl = await getWorkingBaseUrl();
  const response = await fetch(`${baseUrl}/health`);
  if (!response.ok) {
    throw new Error("API offline");
  }
  return await response.json();
}

export async function getRecommendations(visitorId, limit = 10, minPrice = null, maxPrice = null) {
  const baseUrl = await getWorkingBaseUrl();
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
  console.log("MERN API recommendation response for visitor", visitorId, ":", data);
  return data;
}

export async function getUserStats(visitorId) {
  const baseUrl = await getWorkingBaseUrl();
  const response = await fetch(`${baseUrl}/user/${encodeURIComponent(visitorId)}/stats`);
  if (!response.ok) {
    return null;
  }
  return await response.json();
}

export async function getUserHistory(visitorId) {
  const baseUrl = await getWorkingBaseUrl();
  const response = await fetch(`${baseUrl}/user/${encodeURIComponent(visitorId)}/history`);
  if (!response.ok) {
    return null;
  }
  return await response.json();
}

export async function getSampleUser() {
  const baseUrl = await getWorkingBaseUrl();
  const response = await fetch(`${baseUrl}/users/sample`);
  if (!response.ok) {
    throw new Error("Failed to fetch sample user");
  }
  return await response.json();
}

export async function recordViewEvent(visitorId, itemId) {
  const baseUrl = await getWorkingBaseUrl();
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
  const baseUrl = await getWorkingBaseUrl();
  const response = await fetch(`${baseUrl}/user/${encodeURIComponent(visitorId)}/price-preference`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ min_price: minPrice, max_price: maxPrice })
  });
  return await response.json();
}

export async function getPricePreference(visitorId) {
  const baseUrl = await getWorkingBaseUrl();
  const response = await fetch(`${baseUrl}/user/${encodeURIComponent(visitorId)}/price-preference`);
  if (!response.ok) return null;
  return await response.json();
}

export async function getAllProducts() {
  const baseUrl = await getWorkingBaseUrl();
  const response = await fetch(`${baseUrl}/products`);
  if (!response.ok) return { products: [] };
  return await response.json();
}
