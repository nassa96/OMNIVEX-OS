-- ============================================================
-- SAINT OMNIVEX — SUPABASE MIGRATION
-- File: supabase_migration.sql
-- Purpose: Full institutional database schema for execution kernel
-- ============================================================

-- =========================
-- SIGNALS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal TEXT NOT NULL,
  confidence FLOAT,
  risk TEXT,
  price FLOAT,
  volatility TEXT,
  reason TEXT,
  allowed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY signals_service_access ON signals
  FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_signals_created ON signals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_signals_allowed ON signals(allowed);

-- =========================
-- TRADES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal TEXT NOT NULL,
  confidence FLOAT,
  price FLOAT,
  pnl FLOAT,
  trade_number INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

CREATE POLICY trades_service_access ON trades
  FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_trades_created ON trades(created_at DESC);

-- =========================
-- CHAT LOGS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS chat_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT DEFAULT 'anonymous',
  message TEXT NOT NULL,
  reply TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY chat_service_access ON chat_logs
  FOR ALL USING (auth.role() = 'service_role');

-- =========================
-- SUBSCRIBERS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT DEFAULT 'free',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY subscribers_service_access ON subscribers
  FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);

-- =========================
-- USERS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_service_access ON users
  FOR ALL USING (auth.role() = 'service_role');

-- =========================
-- CONFIG TABLE
-- =========================
CREATE TABLE IF NOT EXISTS config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE config ENABLE ROW LEVEL SECURITY;

CREATE POLICY config_service_access ON config
  FOR ALL USING (auth.role() = 'service_role');

-- Seed configuration (core system defaults)
INSERT INTO config (key, value) VALUES
  ('trade_mode', 'PAPER'),
  ('confidence_floor', '0.75'),
  ('risk_high_floor', '0.88'),
  ('cooldown_ms', '6000'),
  ('platform_name', 'SAINT OMNIVEX'),
  ('version', '2.0.0')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- END OF MIGRATION
-- ============================================================
