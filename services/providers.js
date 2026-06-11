import axios from "axios";
import { ENV } from "../utils/env.js";

export async function fetchCoinGecko() {
  return axios.get("https://api.coingecko.com/api/v3/global");
}

export async function fetchGeckoTerminal() {
  return axios.get("https://api.geckoterminal.com/api/v2/networks");
}
