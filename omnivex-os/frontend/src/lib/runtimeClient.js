const API_URL = "http://localhost:3000";

async function request(path) {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new Error(
      `Runtime API error: ${response.status}`
    );
  }

  return response.json();
}

export function getRuntimeAgents() {
  return request("/api/runtime/agents");
}

export function getRuntimeHealth() {
  return request("/health");
}

export function getRuntimeState() {
  return request("/state");
}
