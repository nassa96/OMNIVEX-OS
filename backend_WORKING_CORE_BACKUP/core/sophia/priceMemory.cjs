/**
 * SOPHIA PRICE MEMORY
 * SAINT PRIMAL v13
 */

class PriceMemory {

  constructor(){

    this.prices = {};

  }


  update(symbol, price){

    if(!symbol || typeof price !== "number"){
      return;
    }


    if(!this.prices[symbol]){
      this.prices[symbol] = [];
    }


    this.prices[symbol].push({

      price,

      timestamp: Date.now()

    });



    if(this.prices[symbol].length > 100){

      this.prices[symbol].shift();

    }

  }



  get(symbol){

    return this.prices[symbol] || [];

  }


}



module.exports = new PriceMemory();
