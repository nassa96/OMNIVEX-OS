const fs = require("fs");
const path = require("path");


class ChronicleStore {

    constructor(){

        this.file = path.join(
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

        }catch(err){

            console.error(
                "[CHRONICLE LOAD ERROR]",
                err.message
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


    record(event){

        const entry = {

            id:
            this.events.length + 1,

            timestamp:
            Date.now(),

            ...event

        };


        this.events.push(entry);

        this.save();


        console.log(
            "[CHRONICLE]",
            "EVENT STORED",
            entry.id
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


    replay(){

        return this.events.map(
            event => ({
                timestamp:event.timestamp,
                type:event.type,
                action:event.action
            })
        );

    }


    clear(){

        this.events=[];

        this.save();

    }

}


module.exports =
new ChronicleStore();
