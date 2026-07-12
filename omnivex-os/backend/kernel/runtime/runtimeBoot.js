const startRuntime = require("./startRuntime");

module.exports = function runtimeBoot(){

    console.log(
        "[OMNIVEX RUNTIME BOOT]"
    );

    return startRuntime();

};
