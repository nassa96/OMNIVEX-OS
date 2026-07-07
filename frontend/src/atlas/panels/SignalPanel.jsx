import { useAtlasStream } from "../hooks/useAtlasStream";

export default function SignalPanel() {
  const signals = useAtlasStream();

  return (
    <div className="panel">
      <h2>LIVE SAINT SIGNALS</h2>

      <div className="signals">
        {signals.map((s, i) => (
          <div key={i} className="signal">
            <div>TYPE: {s.type}</div>
            <div>SYMBOL: {s.data?.symbol}</div>
            <div>PRICE: {s.data?.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
