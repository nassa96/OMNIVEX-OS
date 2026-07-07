import "dotenv/config";

/**
 * Zernio Adapter Layer (SAFE MODE)
 * Prevents system crash if SDK is missing or API is unavailable
 */

const apiKey = process.env.ZERNIO_API_KEY;

function logMissing(action) {
  console.warn(`[ZERNIO SAFE MODE] ${action} skipped - missing SDK or API key`);
}

export async function connectInstagram() {
  if (!apiKey) {
    logMissing("connectInstagram");
    return { ok: false, reason: "missing_api_key" };
  }

  // placeholder for future SDK integration
  return {
    ok: true,
    platform: "instagram",
    status: "simulated_connection"
  };
}

export async function publishMultiPlatform(text) {
  if (!apiKey) {
    logMissing("publishMultiPlatform");
    return { ok: false, reason: "missing_api_key" };
  }

  return {
    ok: true,
    published: true,
    platforms: ["instagram", "linkedin", "tiktok"],
    text
  };
}

export async function purchaseWhatsAppNumber() {
  if (!apiKey) {
    logMissing("purchaseWhatsAppNumber");
    return { ok: false, reason: "missing_api_key" };
  }

  return {
    ok: true,
    number: "+1-simulated",
    status: "reserved"
  };
}
