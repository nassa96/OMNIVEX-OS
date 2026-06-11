import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3000,

  SYSTEM_MODE: process.env.SYSTEM_MODE || "PAPER",
  KERNEL_LOCK: process.env.KERNEL_LOCK === "true",

  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,

  OPENAI_API_KEY: process.env.OPENAI_API_KEY,

  COINMARKETCAP_API_KEY: process.env.COINMARKETCAP_API_KEY,
  COINGECKO_API_KEY: process.env.COINGECKO_API_KEY,
  COVALENT_API_KEY: process.env.COVALENT_API_KEY,
  MORALIS_API_KEY: process.env.MORALIS_API_KEY,
};
