/**
 * SAINT V75 — DOCKER STACK GENERATOR
 */

class DockerStackV75 {

  generate() {

    return `
version: "3.9"
services:
  saint:
    build: .
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    `;
  }
}

module.exports = DockerStackV75;
