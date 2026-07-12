/**
 * OMNIVEX OS PRIME
 *
 * FEED MANAGER
 *
 * Responsibilities:
 * - lifecycle ownership of market feeds
 * - market event aggregation
 * - throttled operational logging
 * - feed health reporting
 */

const coinbaseFeed =
    require("./coinbaseFeed");

const eventBus =
    require("../eventBus");


class FeedManager {


    constructor(){

        this.feeds = {};

        this.running = false;

        this.ticks = 0;

        this.lastLog = 0;

        this.logInterval = 10000;

        this.marketState = {};

        this.eventHandler = null;

    }


    register(name, feed){

        if(!feed)
            return;

        this.feeds[name] = feed;

    }


    bindMarketStream(){

        if(this.eventHandler)
            return;


        this.eventHandler =
            (event)=>{

                const market =
                    event.data || event;


                if(
                    !market.asset
                ){
                    return;
                }


                this.ticks++;


                this.marketState[
                    market.asset
                ] = {

                    ...market,

                    updated:
                        Date.now()

                };


                this.throttledLog();

            };


        eventBus.subscribe(
            "market.tick",
            this.eventHandler
        );

    }


    throttledLog(){

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
            "[MARKET AGGREGATE]",
            {
                ticks:
                    this.ticks,

                assets:
                    Object.keys(
                        this.marketState
                    ),

                timestamp:
                    now
            }
        );

    }


    start(){

        if(this.running)
            return;


        this.running = true;


        console.log(
            "[FEED MANAGER ONLINE]"
        );


        this.bindMarketStream();


        this.register(
            "coinbase",
            coinbaseFeed
        );


        for(
            const [name, feed]
            of Object.entries(this.feeds)
        ){

            try{


                if(
                    feed &&
                    typeof feed.connect === "function"
                ){

                    feed.connect();


                    console.log(
                        `[${name.toUpperCase()} FEED STARTED]`
                    );

                }


            }
            catch(error){

                console.error(
                    `[${name.toUpperCase()} FEED ERROR]`,
                    error.message
                );

            }

        }

    }



    stop(){


        if(!this.running)
            return;


        this.running = false;


        for(
            const [name, feed]
            of Object.entries(this.feeds)
        ){

            try{


                if(
                    feed &&
                    typeof feed.stop === "function"
                ){

                    feed.stop();


                    console.log(
                        `[${name.toUpperCase()} FEED STOPPED]`
                    );

                }


            }
            catch(error){

                console.error(
                    `[${name.toUpperCase()} STOP ERROR]`,
                    error.message
                );

            }

        }


    }



    status(){

        return {

            running:
                this.running,

            feeds:
                Object.keys(
                    this.feeds
                ),

            ticks:
                this.ticks,

            markets:
                this.marketState

        };

    }


}


module.exports =
    new FeedManager();
