async function placeOrder(order) {
  const slippage = (Math.random() - 0.5) * 0.15;
  const fillPrice = order.price * (1 + slippage);

  return {
    status: "LIVE_MOCK_FILL",
    exchange: "coinbase",
    symbol: order.symbol,
    side: order.side,
    size: order.size,
    requestedPrice: order.price,
    fillPrice,
    timestamp: Date.now()
  };
}

export default { placeOrder };
