const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(path, options = {}) {
  let token = "";

  try {
    token =
      JSON.parse(sessionStorage.getItem("domainreg_session") || "{}").token ||
      "";
  } catch {
    token = "";
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      payload.message || `Request failed (${response.status}).`
    );
  }

  return payload;
}

export function fetchReportSummary() {
  return request("/reports/summary");
}

export function fetchReportOptions() {
  return request("/reports/options");
}

export function fetchReports(filters = {}) {
  const query = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });

  const suffix = query.toString() ? `?${query.toString()}` : "";
  return request(`/reports${suffix}`);
}

export function searchReports(filters = {}) {
  const { page, ...body } = filters;
  const query = new URLSearchParams();

  if (page !== undefined && page !== null) {
    query.set("page", String(page));
  }

  const suffix = query.toString() ? `?${query.toString()}` : "";

  return request(`/reports/search${suffix}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
