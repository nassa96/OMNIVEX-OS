/**
 * OMNIVEX OS PRIME
 *
 * CANONICAL 16 AGENT REGISTRY
 *
 * SOURCE OF TRUTH
 *
 * This file defines the official intelligence
 * ownership model.
 */

module.exports = {

    STREAMCORE:{
        role:"market_ingestion",
        layer:"infrastructure",
        owner:"backend/core/streams"
    },

    MERCURY:{
        role:"data_normalization",
        layer:"intelligence",
        owner:"backend/kernel/mercury"
    },

    CHRONICLE:{
        role:"memory_replay_audit",
        layer:"memory",
        owner:"backend/kernel/memory"
    },

    SOPHIA:{
        role:"market_intelligence",
        layer:"intelligence",
        owner:"backend/kernel/sophia"
    },

    ORACLE:{
        role:"external_context",
        layer:"intelligence",
        owner:"backend/core/oracle"
    },

    REGIME:{
        role:"market_classification",
        layer:"intelligence",
        owner:"backend/core/regime"
    },

    OPPORTUNITY_LAB:{
        role:"strategy_discovery",
        layer:"intelligence",
        owner:"backend/core/opportunity"
    },

    FORGE:{
        role:"strategy_evolution",
        layer:"learning",
        owner:"backend/core/forge"
    },

    ELOHIM:{
        role:"orchestration_governance",
        layer:"authority",
        owner:"backend/kernel/elohimOrchestrator.js"
    },

    AEGIS:{
        role:"risk_governance",
        layer:"security",
        owner:"backend/kernel/aegis"
    },

    SAINT:{
        role:"execution_engine",
        layer:"execution",
        owner:"backend/kernel/saint"
    },

    LEDGER:{
        role:"accounting",
        layer:"finance",
        owner:"backend/core/ledger"
    },

    SENTINEL:{
        role:"system_monitoring",
        layer:"security",
        owner:"backend/core/sentinel"
    },

    NEXUS:{
        role:"capital_allocation",
        layer:"finance",
        owner:"backend/core/capital"
    },

    PROMETHEUS:{
        role:"research_evolution",
        layer:"learning",
        owner:"backend/core/research"
    },

    ATLAS:{
        role:"command_interface",
        layer:"frontend",
        owner:"frontend"
    }

};
