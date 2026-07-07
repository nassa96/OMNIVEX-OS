export default function MomentumBar({ value = 0 }) {
  const normalized = (value + 1) / 2; // map -1..1 → 0..1
  const width = Math.max(0, Math.min(100, normalized * 100));

  const color =
    value >= 0.6 ? "#00ff99" :
    value >= 0.2 ? "#4da6ff" :
    value <= -0.6 ? "#ff4d4d" :
    value <= -0.2 ? "#ff884d" :
    "#666";

  return (
    <div style={styles.wrap}>
      <div style={styles.track}>
        <div style={{ ...styles.fill, width: `${width}%`, background: color }} />
      </div>

      <div style={styles.label}>
        {value.toFixed(3)}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    marginTop: 8
  },
  track: {
    height: 6,
    background: "#111",
    borderRadius: 3,
    overflow: "hidden"
  },
  fill: {
    height: "100%",
    transition: "width 0.2s ease"
  },
  label: {
    fontSize: 10,
    opacity: 0.7,
    marginTop: 4
  }
};
