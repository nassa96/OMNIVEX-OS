/**
 * OMNIVEX OS PRIME
 *
 * COINBASE MARKET FEED
 *
 * Responsibilities:
 * - websocket lifecycle
 * - reconnect handling
 * - normalized market events
 * - controlled operational logging
 */

const WebSocket = require("ws");

const mercuryAdapter =
    require("../mercuryAdapter");


class CoinbaseFeed {


    constructor(){

        this.ws = null;

        this.running = false;

        this.connected = false;

        this.reconnectTimer = null;

        this.lastPrices = {};

        this.lastLog = 0;

        this.logInterval = 10000;

        this.products = [
            "BTC-USD",
            "ETH-USD",
            "SOL-USD"
        ];

    }


    connect(){

        if(
            this.running
        ){
            return;
        }


        this.running = true;

        this.open();

    }


    open(){

        if(
            !this.running
        ){
            return;
        }


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
                        type:
                            "subscribe",

                        product_ids:
                            this.products,

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

                this.handleMessage(
                    data
                );

            }
        );


        this.ws.on(
            "close",
            ()=>{

                this.connected = false;


                if(
                    this.running
                ){
                    this.scheduleReconnect();
                }

            }
        );


        this.ws.on(
            "error",
            error=>{

                console.error(
                    "[COINBASE ERROR]",
                    error.message
                );

            }
        );

    }


    handleMessage(data){

        try{

            const tick =
                JSON.parse(
                    data.toString()
                );


            if(
                tick.type !== "ticker"
            ){
                return;
            }


            if(
                !tick.product_id ||
                !tick.price
            ){
                return;
            }


            const asset =
                tick.product_id
                    .split("-")[0];


            const price =
                Number(
                    tick.price
                );


            const volume =
                Number(
                    tick.volume || 0
                );


            if(
                !Number.isFinite(price)
            ){
                return;
            }


            this.lastPrices[asset] =
                price;


            const event = {

                venue:
                    "coinbase",

                asset,

                symbol:
                    tick.product_id,

                price,

                volume,

                timestamp:
                    Date.now()

            };


            mercuryAdapter.emit(
                "market.tick",
                {
                    data:
                        event
                }
            );


            mercuryAdapter.emit(
                "raw.feed",
                {
                    data:
                        event
                }
            );


            this.logTick(
                event
            );


        }
        catch(error){

            console.error(
                "[COINBASE PARSE ERROR]",
                error.message
            );

        }

    }


    logTick(data){

        const now =
            Date.now();


        if(
            now - this.lastLog <
            this.logInterval
        ){
            return;
        }


        this.lastLog =
            now;


        console.log(
            "[COINBASE MARKET]",
            data
        );

    }


    scheduleReconnect(){

        if(
            this.reconnectTimer
        ){
            return;
        }


        this.reconnectTimer =
            setTimeout(
                ()=>{

                    this.reconnectTimer =
                        null;

                    this.open();

                },
                5000
            );

    }


    stop(){

        this.running = false;


        if(
            this.reconnectTimer
        ){

            clearTimeout(
                this.reconnectTimer
            );

            this.reconnectTimer = null;

        }


        if(
            this.ws
        ){

            this.ws.close();

            this.ws = null;

        }


        this.connected = false;


        console.log(
            "[COINBASE FEED STOPPED]"
        );

    }


    status(){

        return {

            connected:
                this.connected,

            assets:
                Object.keys(
                    this.lastPrices
                )

        };

    }

}


module.exports =
    new CoinbaseFeed();
