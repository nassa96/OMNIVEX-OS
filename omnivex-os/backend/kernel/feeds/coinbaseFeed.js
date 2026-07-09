const WebSocket = require("ws");

const mercuryAdapter =
require("../mercuryAdapter");


class CoinbaseFeed {

    constructor(){

        this.ws = null;

        this.connected = false;

    }


    connect(){

        if(this.connected)
            return;


        this.ws =
        new WebSocket(
            "wss://ws-feed.exchange.coinbase.com"
        );


        this.ws.on(
            "open",
            ()=>{

                this.connected = true;


                console.log(
                    "[COINBASE FEED ONLINE]"
                );


                this.ws.send(
                    JSON.stringify({

                        type:"subscribe",

                        product_ids:[
                            "BTC-USD",
                            "ETH-USD",
                            "SOL-USD"
                        ],

                        channels:[
                            "ticker"
                        ]

                    })
                );

            }
        );


        this.ws.on(
            "message",
            data=>{

                try{

                    const tick =
                    JSON.parse(
                        data.toString()
                    );


                    if(
                        tick.type !== "ticker"
                    )
                        return;


                    const event = {

                        type:"raw.feed",

                        data:{

                            venue:"coinbase",

                            asset:
                            tick.product_id
                            .split("-")[0],

                            price:
                            Number(
                                tick.price
                            ),

                            volume:
                            Number(
                                tick.volume || 0
                            )

                        }

                    };


                    console.log(
                        "[COINBASE TICK]",
                        event.data
                    );


                    mercuryAdapter.emit(
                        "raw.feed",
                        event
                    );


                }
                catch(err){

                    console.error(
                        "[COINBASE PARSE ERROR]",
                        err.message
                    );

                }

            }
        );


        this.ws.on(
            "close",
            ()=>{

                this.connected=false;

                console.log(
                    "[COINBASE FEED CLOSED]"
                );

            }
        );


        this.ws.on(
            "error",
            err=>{

                console.error(
                    "[COINBASE ERROR]",
                    err.message
                );

            }
        );

    }


    stop(){

        if(this.ws){

            this.ws.close();

        }

    }

}


module.exports =
new CoinbaseFeed();
