import { getEnv } from "../../kernel/env.js";

export function providerRegistry() {
  return {
    openai: !!getEnv("OPENAI_API_KEY"),
    supabase: !!getEnv("SUPABASE_URL"),
    etherscan: !!getEnv("ETHERSCAN_API_KEY"),
    moralis: !!getEnv("MORALIS_API_KEY"),
    covalent: !!getEnv("COVALENT_API_KEY"),
    coingecko: !!getEnv("COINGECKO_API_KEY"),
    coinbase: !!getEnv("COINBASE_API_KEY"),
    kraken: !!getEnv("KRAKEN_API_KEY"),
    binance: !!getEnv("BINANCE_API_KEY"),
    dexscreener: true,
    tronscan: !!getEnv("TRONSCAN_API_KEY"),
    quicknode: !!getEnv("QUICKNODE_API_KEY"),
    alchemy: !!getEnv("ALCHEMY_API_KEY"),
    zernio: !!getEnv("ZERNIO_API_KEY")
  };
}
