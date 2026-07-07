import { SophiaEngine } from "../engines/sophia.js";
import { ElohimEngine } from "../engines/elohim.js";
import { ConsensusEngine } from "../engines/consensus.js";
import { StrategySwitcher } from "../engines/strategySwitcher.js";
import { TraceEngine } from "../engines/decisionTrace.js";
import { ExecutionStateMachine } from "../execution/stateMachine/stateMachine.js";
import { ExecutionRouter } from "../execution/executionRouter.js";
import { runAegis } from "../engines/aegis.js";

export function createModules() {
  const stateMachine = new ExecutionStateMachine();

  const executionRouter = new ExecutionRouter(stateMachine);

  return {
    sophia: new SophiaEngine(),
    elohim: new ElohimEngine(),
    consensus: new ConsensusEngine(),
    strategy: new StrategySwitcher(),
    trace: new TraceEngine(),
    risk: {
      evaluate: runAegis
    },
    execution: executionRouter,
    stateMachine
  };
}
