import Dashboard from "./views/dashboard/Dashboard";

export default function App() {

  return (
    <div className="app-shell">

      <header className="brand-header">

        <div className="brand-main">
          VEYRONIX
        </div>

        <div className="brand-sub">
          AUTONOMOUS INTELLIGENCE COMMAND CENTER
        </div>

        <div className="engine-label">
          POWERED BY OMNIVEX OS PRIME
        </div>

      </header>


      <main>
        <Dashboard />
      </main>

    </div>
  );
}
