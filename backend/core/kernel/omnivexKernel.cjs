const mercuryBus = require("../market/bus/mercuryBus.cjs");

const chronicle = require("../chronicle/chronicle.cjs");

let modules = {};

function safeLoad(name, path) {
    try {
        modules[name] = require(path);
        console.log(`[KERNEL] ${name} ONLINE`);
        return modules[name];
    } catch (err) {
        console.log(`[KERNEL] ${name} OFFLINE`);
        console.log(err.message);
        return null;
    }
}

function boot() {

    console.log("[OMNIVEX KERNEL] BOOTING");

    safeLoad(
        "ELOHIM",
        "../elohim"
    );

    safeLoad(
        "AURYN",
        "../auryn/auryn.js"
    );

    safeLoad(
        "AEGIS",
        "../aegis/index.cjs"
    );

    safeLoad(
        "SOPHIA",
        "../sophia/sophiaBridge.cjs"
    );

    safeLoad(
        "FORGE",
        "../forge/index.cjs"
    );

    safeLoad(
        "PROMETHEUS",
        "../prometheus/prometheus.js"
    );

    safeLoad(
        "SAINT",
        "../saint/saint.js"
    );

    safeLoad(
        "PORTFOLIO",
        "../portfolio/portfolioEngine.cjs"
    );

    safeLoad(
        "REPLAY",
        "../replay/replay.js"
    );

    console.log("[OMNIVEX KERNEL] MODULE REGISTRY ONLINE");

}

module.exports = {
    boot,
    modules
};
