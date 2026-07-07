/**
 * SAINT V80 — REDIS STREAM ENGINE
 * Real-time buffering layer
 */

class RedisStreamV80 {

  constructor(redis) {
    this.redis = redis;
  }

  publish(stream, data) {
    this.redis.push(stream, data);
  }

  read(stream) {
    return this.redis.get(stream) || [];
  }
}

module.exports = RedisStreamV80;
