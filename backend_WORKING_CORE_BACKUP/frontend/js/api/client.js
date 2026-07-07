const API = "http://localhost:3000";

export async function getHealth() {
  const res = await fetch(`${API}/health`);
  return res.json();
}

export async function getSignal() {
  const res = await fetch(`${API}/signal`);
  return res.json();
}

export async function getBraintrust() {
  const res = await fetch(`${API}/braintrust`);
  return res.json();
}

export async function getChronicle() {
  const res = await fetch(`${API}/chronicle`);
  return res.json();
}
