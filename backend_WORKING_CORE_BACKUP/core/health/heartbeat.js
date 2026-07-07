function createHeartbeatRoute(elohim) {
  return (req, res) => {
    elohim.heartbeat();

    res.json({
      status: elohim.getStatus(),
      decision: elohim.evaluateSystem()
    });
  };
}

module.exports = { createHeartbeatRoute };
