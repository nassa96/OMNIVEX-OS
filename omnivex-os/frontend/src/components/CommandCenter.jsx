import { useEffect, useState } from "react";
import { createWS } from "../lib/ws";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function CommandCenter() {
  const [war, setWar] = useState([]);
  const [elohim, setElohim] = useState(null);
  const [aegis, setAegis] = useState(null);
  const [saint, setSaint] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [pnl, setPnl] = useState([]);

  useEffect(() => {
    const ws = createWS((data) => {
      if (data.type !== "COSMIC_STATE") return;

      setWar(data.war || []);
      setElohim(data.elohim);
      setAegis(data.aegis);
      setSaint(data.saint);
      setLeaderboard(data.leaderboard);
    });

    fetch("http://localhost:3000/pnl")
      .then(r => r.json())
      .then(setPnl);

    const i = setInterval(() => {
      fetch("http://localhost:3000/pnl")
        .then(r => r.json())
        .then(setPnl);
    }, 3000);

    return () => {
      ws.close();
      clearInterval(i);
    };
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>OMNIVEX COMMAND CENTER</h1>

      {/* TOP METRICS */}
      <div style={styles.gridTop}>
        <Panel title="ELOHIM">
          <Metric value={elohim?.final?.score || 0} />
          <SubText>{elohim?.mode}</SubText>
        </Panel>

        <Panel title="AEGIS RISK">
          <Metric value={aegis?.riskScore || 0} />
          <SubText>{aegis?.reason}</SubText>
        </Panel>

        <Panel title="SAINT TRADES">
          <Metric value={saint?.trades?.length || 0} />
          <SubText>{saint?.blocked ? "BLOCKED" : "ACTIVE"}</SubText>
        </Panel>
      </div>

      {/* 1. EQUITY CURVE */}
      <Panel title="SAINT EQUITY CURVE">
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pnl}>
              <XAxis dataKey="ts" hide />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="pnl"
                stroke="#00ff99"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      {/* 2. MAIN GRID */}
      <div style={styles.gridMain}>
        <Panel title="WAR MAP (ASSET CONTROL)">
          {war.slice(0, 10).map((w, i) => (
            <Row key={i}>
              <span>{w.symbol}</span>
              <span>{w.controller}</span>
              <span>{w.score.toFixed(2)}</span>
            </Row>
          ))}
        </Panel>

        <Panel title="FORGE DOMINANCE">
          {leaderboard?.agents?.map((a, i) => (
            <Row key={i}>
              <span>{a.agent}</span>
              <span>{a.power.toFixed(2)}</span>
            </Row>
          ))}
        </Panel>
      </div>

      {/* 3. POSITION VIEW */}
      <Panel title="SAINT POSITIONS">
        {Object.entries(saint?.positions || {}).map(([k, v], i) => (
          <Row key={i}>
            <span>{k}</span>
            <span>entry: {v.entry}</span>
            <span>pnl: {v.pnl.toFixed(4)}</span>
          </Row>
        ))}
      </Panel>

      {/* 4. HEATMAP */}
      <Panel title="MARKET HEAT (WAR INTENSITY)">
        {war.slice(0, 10).map((w, i) => (
          <HeatBar key={i} value={w.score} label={w.symbol} />
        ))}
      </Panel>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Panel({ title, children }) {
  return (
    <div style={styles.panel}>
      <h3 style={styles.panelTitle}>{title}</h3>
      {children}
    </div>
  );
}

function Metric({ value }) {
  return <div style={styles.metric}>{Number(value).toFixed(3)}</div>;
}

function SubText({ children }) {
  return <div style={styles.sub}>{children}</div>;
}

function Row({ children }) {
  return <div style={styles.row}>{children}</div>;
}

function HeatBar({ value, label }) {
  const color =
    value > 0.7 ? "#ff4d4d" :
    value > 0.4 ? "#ffaa00" :
    "#00ff99";

  return (
    <div style={{ marginBottom: 6 }}>
      <div style={styles.heatLabel}>{label}</div>
      <div style={{ ...styles.heatBar, width: `${value * 100}%`, background: color }} />
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    background: "#05070a",
    color: "#fff",
    minHeight: "100vh",
    padding: 20,
    fontFamily: "monospace"
  },
  title: {
    color: "#00ff99",
    marginBottom: 20
  },
  gridTop: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
    marginBottom: 20
  },
  gridMain: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginTop: 10
  },
  panel: {
    background: "#0b1118",
    padding: 15,
    border: "1px solid #1f2a36",
    borderRadius: 6,
    marginBottom: 10
  },
  panelTitle: {
    color: "#4da6ff",
    marginBottom: 10
  },
  metric: {
    fontSize: 26,
    color: "#00ff99"
  },
  sub: {
    color: "#aaa",
    fontSize: 12
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    padding: "3px 0",
    borderBottom: "1px solid #1a2430"
  },
  heatLabel: {
    fontSize: 11,
    color: "#aaa"
  },
  heatBar: {
    height: 6,
    borderRadius: 3
  }
};
