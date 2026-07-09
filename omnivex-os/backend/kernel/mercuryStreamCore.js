/**
 * OMNIVEX OS — MERCURY v2 STREAMCORE
 * Live market ingestion
 * Normalization
 * Anomaly detection
 * Meme burst detection
 * Deterministic market state
 */

function createMercuryStreamCore({ bus, chronicle } = {}) {

    if (!bus)
        throw new Error(
            "Mercury StreamCore requires event bus"
        );


    const marketState = {

        BTC:{
            price:0,
            volume:0
        },

        ETH:{
            price:0,
            volume:0
        },

        SOL:{
            price:0,
            volume:0
        },

        ALT:{
            price:0,
            volume:0
        }

    };



    function normalize(event){

        const data =
        event?.data || {};


        return {

            venue:
            data.venue || "unknown",


            asset:
            data.asset || "BTC",


            price:
            Number(
                data.price || 0
            ),


            volume:
            Number(
                data.volume || 0
            ),


            timestamp:
            Date.now(),


            raw:event

        };

    }



    function detectSpike(asset, price){

        const previous =
        marketState[asset]?.price || 0;


        if(previous === 0)
            return false;


        const change =
        Math.abs(
            price - previous
        ) / previous;


        return change >= 0.05;

    }



    function detectMemeBurst(event){

        const text =
        JSON.stringify(event)
        .toLowerCase();


        const triggers = [

            "pepe",
            "doge",
            "shib",
            "elon",
            "moon",
            "pump",
            "100x"

        ];


        let score = 0;


        for(
            const trigger of triggers
        ){

            if(
                text.includes(trigger)
            )
                score++;

        }


        return score >= 2;

    }



    function process(event){

        const tick =
        normalize(event);


        if(
            !marketState[tick.asset]
        ){

            marketState[tick.asset] = {

                price:0,

                volume:0

            };

        }



        const spike =
        detectSpike(
            tick.asset,
            tick.price
        );



        marketState[tick.asset] = {

            price:
            tick.price,

            volume:
            tick.volume

        };



        const marketEvent = {

            type:
            "market.tick",


            ts:
            Date.now(),


            data:
            tick

        };



        console.log(
            "[MERCURY TICK]",
            tick.asset,
            tick.price
        );



        bus.emit(
            "market.tick",
            marketEvent
        );



        if(
            chronicle &&
            typeof chronicle.append === "function"
        ){

            chronicle.append(
                marketEvent
            );

        }



        if(spike){

            const anomaly = {

                type:
                "market.anomaly.spike",


                ts:
                Date.now(),


                asset:
                tick.asset,


                price:
                tick.price

            };


            bus.emit(
                anomaly.type,
                anomaly
            );


            if(
                chronicle &&
                typeof chronicle.append === "function"
            ){

                chronicle.append(
                    anomaly
                );

            }

        }



        if(
            detectMemeBurst(event)
        ){

            const meme = {

                type:
                "market.meme.burst",


                ts:
                Date.now(),


                asset:
                tick.asset,


                price:
                tick.price

            };


            bus.emit(
                meme.type,
                meme
            );


            if(
                chronicle &&
                typeof chronicle.append === "function"
            ){

                chronicle.append(
                    meme
                );

            }

        }


        return marketEvent;

    }



    function getState(){

        return {

            BTC:{
                ...marketState.BTC
            },

            ETH:{
                ...marketState.ETH
            },

            SOL:{
                ...marketState.SOL
            },

            ALT:{
                ...marketState.ALT
            }

        };

    }



    bus.on(
        "raw.feed",
        process
    );



    console.log(
        "[MERCURY STREAMCORE ONLINE]"
    );



    return {

        process,

        getState

    };

}



module.exports =
createMercuryStreamCore;
