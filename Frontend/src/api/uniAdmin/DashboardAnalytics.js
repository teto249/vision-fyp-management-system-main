const API_BASE_URL = "http://localhost:3001/api/uniAdmin/analytics";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function fetchWithAuth(url, options = {}) {
  const authToken = localStorage.getItem("authToken");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (authToken) {
    headers["authorization"] = `Bearer ${authToken}`;
  } else {
    throw new ApiError("No authentication token found");
  }

  const response = await fetch(url, { ...options, headers });
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  if (!response.ok) {
    const errorMessage = isJson
      ? (await response.json()).message
      : response.statusText;
    throw new ApiError(errorMessage, response.status);
  }

  return isJson ? response.json() : null;
}

function isDashboardAnalytics(data) {
  return (
    data &&
    typeof data === "object" &&
    data.success === true &&
    typeof data.metrics === "object" &&
    Array.isArray(data.milestoneProgress) &&
    typeof data.systemStatus === "object" &&
    Array.isArray(data.projects)
  );
}

export async function fetchDashboardAnalytics(universityId) {
  try {
    if (!universityId) {
      throw new ApiError("University ID is required");
    }

    const url = `${API_BASE_URL}/${encodeURIComponent(universityId)}`;
    const data = await fetchWithAuth(url);

    if (!isDashboardAnalytics(data)) {
      throw new ApiError("Invalid dashboard analytics response format");
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      error instanceof Error ? error.message : "Failed to fetch dashboard analytics"
    );
  }
}
