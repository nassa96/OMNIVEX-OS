// ============================================================
// SAINT OMNIVEX — CHAT ROUTE
// File: routes/chat.js
// AI-powered chat endpoint. Uses OpenAI if key present, fallback otherwise.
// ============================================================

import express from "express";
import { logChat } from "../core/supabaseLogger.js";

const router = express.Router();

const SYSTEM_PROMPT = `You are SAINT — an elite AI trading intelligence built on the OMNIVEX platform. 
You are precise, confident, and data-driven. You analyze crypto markets, explain trading signals, 
interpret risk, and guide users through market conditions. 
You speak with authority but never give financial advice — you provide intelligence and analysis.
Keep responses concise and sharp. Use market terminology. Reference BTC/USD context when relevant.
Never be vague. Always give the user something actionable or insightful.`;

async function callOpenAI(messages) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 300,
      temperature: 0.7
    })
  });

  if (!res.ok) throw new Error(`OpenAI ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "Signal unclear. Try again.";
}

router.post("/", async (req, res) => {
  const { message, userId, history = [] } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message required" });
  }

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.slice(-6), // last 3 exchanges for context
    { role: "user", content: message }
  ];

  let reply;

  try {
    if (process.env.OPENAI_API_KEY) {
      reply = await callOpenAI(messages);
    } else {
      // Intelligent fallback responses without OpenAI
      const lower = message.toLowerCase();
      if (lower.includes("buy") || lower.includes("signal")) {
        reply = "Current BUY signals require confidence ≥ 0.75 and EMA9 crossing above EMA21. Monitor the execution log for approved entries.";
      } else if (lower.includes("sell")) {
        reply = "SELL signals trigger when EMA9 drops below EMA21 with sufficient momentum. Risk gates are active — HIGH risk requires confidence ≥ 0.88.";
      } else if (lower.includes("risk")) {
        reply = "Risk levels are computed from price volatility. EXTREME volatility triggers a full execution halt regardless of confidence. SAINT protects capital first.";
      } else if (lower.includes("pnl") || lower.includes("profit")) {
        reply = "PNL is tracked per session in paper mode. All trades are logged to Supabase for historical analysis. Live mode requires verified exchange API keys.";
      } else if (lower.includes("how") && lower.includes("work")) {
        reply = "SAINT uses EMA crossover signals fused with confidence scoring, 5-gate kernel arbitration, and real-time CoinGecko price feeds. Nothing executes without passing all gates.";
      } else {
        reply = "SAINT KERNEL ONLINE. I monitor BTC/USD in real-time, generate EMA-based signals, and gate every execution through a 5-layer decision kernel. What intelligence do you need?";
      }
    }
  } catch (err) {
    console.error("[CHAT] Error:", err.message);
    reply = "Intelligence layer temporarily offline. Core execution kernel remains active.";
  }

  // Log to Supabase
  await logChat({ userId, message, reply });

  res.json({ reply, timestamp: Date.now() });
});

export default router;

