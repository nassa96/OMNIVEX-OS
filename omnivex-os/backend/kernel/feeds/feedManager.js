const coinbaseFeed =
require("./coinbaseFeed");


class FeedManager {


    start(){

        console.log(
            "[FEED MANAGER ONLINE]"
        );


        coinbaseFeed.connect();

    }


    stop(){

        coinbaseFeed.stop();

    }


}


module.exports =
new FeedManager();
