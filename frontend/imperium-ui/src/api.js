const BASE_URL = "http://127.0.0.1:4000";

export async function pingBackend() {
  const res = await fetch(`${BASE_URL}/api/ping`);
  return res.json();
}
