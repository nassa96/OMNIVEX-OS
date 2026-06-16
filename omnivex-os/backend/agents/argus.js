export default function argus(bus) {
  setInterval(() => {
    console.log("SYSTEM HEALTH OK");
  }, 5000);

  return {
    onEvent: () => {}
  };
}
