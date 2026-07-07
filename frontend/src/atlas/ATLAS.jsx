import SignalPanel from "./panels/SignalPanel";
import ChroniclePanel from "./panels/ChroniclePanel";

export default function ATLAS() {
  return (
    <div className="atlas-shell">
      <div className="atlas-header">
        <h1>ATLAS TERMINAL</h1>
        <div className="status">SAINT PRIME ACTIVE</div>
      </div>

      <div className="atlas-grid">
        <SignalPanel />
        <ChroniclePanel />
      </div>
    </div>
  );
}
