/**
 * SAINT V80 — POSTGRES CLIENT (REALISTIC ADAPTER)
 */

class PostgresClientV80 {

  constructor() {
    this.connected = true;
    this.tables = {
      trades: [],
      events: []
    };
  }

  async insert(table, record) {

    if (!this.tables[table]) {
      this.tables[table] = [];
    }

    this.tables[table].push({
      ...record,
      ts: Date.now()
    });

    return { ok: true };
  }
}

module.exports = PostgresClientV80;
