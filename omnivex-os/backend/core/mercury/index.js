/**
 * OMNIVEX OS
 * MERCURY MARKET INGESTION CORE
 *
 * Single deterministic market provider
 */

class Mercury {

  constructor(){
    this.state = {
      symbol: "BTC-USD",
      price: 62000,
      volume: 0,
      trend: "NEUTRAL",
      timestamp: Date.now()
    };
  }


  async scan(){

    try {

      const res = await fetch(
        "https://api.dexscreener.com/latest/dex/search?q=solana"
      );

      const data = await res.json();

      const pair =
        data.pairs?.[0];


      if(pair){

        this.state = {

          symbol:
            pair.baseToken?.symbol ||
            "SOL",

          price:
            Number(pair.priceUsd || 0),

          volume:
            Number(pair.volume?.h24 || 0),

          trend:
            Number(pair.priceChange?.h24 || 0) > 0
              ? "BULLISH"
              : "BEARISH",

          timestamp:
            Date.now()
        };

      }


      return this.state;


    } catch(err){

      return this.state;

    }

  }


  getState(){

    return this.state;

  }


}


module.exports = Mercury;
