const BASE_URL = "https://api.dropspace.dev";

async function createLaunch(apiKey, payload) {
  const res = await fetch(`${BASE_URL}/launches`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return res.json();
}

async function publishLaunch(apiKey, id) {
  const res = await fetch(`${BASE_URL}/launches/${id}/publish`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`
    }
  });

  return res.json();
}

module.exports = {
  createLaunch,
  publishLaunch
};
