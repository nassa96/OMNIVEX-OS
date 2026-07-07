class BaseAdapter {
  constructor(name) {
    this.name = name;
  }

  normalize(raw) {
    throw new Error("normalize() must be implemented");
  }

  connect() {
    throw new Error("connect() must be implemented");
  }
}

module.exports = BaseAdapter;
