/**
 * OMNIVEX OS PRIME
 *
 * CHRONICLE MEMORY ENGINE
 */

const fs =
    require("fs");

const path =
    require("path");


class ChronicleStore {

    constructor(){

        this.file =
            path.join(
                __dirname,
                "chronicle.events.json"
            );


        this.events = [];

        this.load();

    }



    load(){

        try{

            if(fs.existsSync(this.file)){

                this.events =
                    JSON.parse(
                        fs.readFileSync(
                            this.file,
                            "utf8"
                        )
                    );

            }

        }
        catch(error){

            console.error(
                "[CHRONICLE LOAD ERROR]",
                error.message
            );

            this.events = [];

        }

    }



    save(){

        fs.writeFileSync(

            this.file,

            JSON.stringify(
                this.events,
                null,
                2
            )

        );

    }



    record(event={}){


        if(
            !event.type
        ){

            throw new Error(
                "CHRONICLE EVENT TYPE REQUIRED"
            );

        }



        const entry = {


            id:
                this.events.length + 1,


            timestamp:

                event.timestamp ||
                Date.now(),


            type:
                event.type,


            source:

                event.source ||
                "unknown",


            action:

                event.action ||
                null,


            confidence:

                event.confidence ||
                null,


            data:
                event

        };



        this.events.push(
            entry
        );


        this.save();



        console.log(

            "[CHRONICLE STORED]",

            entry.id,

            entry.type

        );


        return entry;

    }



    all(){

        return this.events;

    }



    latest(){

        return this.events[
            this.events.length - 1
        ];

    }



    replay(limit=100){

        return this.events
            .slice(-limit)
            .map(
                event=>({

                    timestamp:
                        event.timestamp,

                    type:
                        event.type,

                    action:
                        event.action,

                    confidence:
                        event.confidence

                })
            );

    }



    dataset(window=500){

        return {

            events:
                this.events.slice(-window)

        };

    }



    clear(){

        this.events = [];

        this.save();

    }

}


module.exports =
    new ChronicleStore();

