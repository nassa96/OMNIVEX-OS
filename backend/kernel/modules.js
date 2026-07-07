import { sophia } from "../engines/sophia.js";
import { consensus } from "../engines/consensus.js";
import { strategy } from "../engines/strategySwitcher.js";
import { trace } from "../engines/decisionTrace.js";
import { aegis } from "../engines/aegis.js";

import { execution } from "../execution/execution.interface.js";

export const modules = {
  sophia,
  consensus,
  strategy,
  trace,

  risk: aegis,

  execution
};
