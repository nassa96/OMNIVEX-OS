function healthRoute(elohim) {
  return (req, res) => {
    elohim.heartbeat();

    res.json({
      elohim: elohim.getStatus(),
      decision: elohim.evaluate()
    });
  };
}

module.exports = { healthRoute };
