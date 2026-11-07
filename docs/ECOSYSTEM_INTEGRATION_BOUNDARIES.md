# Ecosystem Integration Boundaries

## Purpose

OMNIVEX-OS is the orchestration and operator-facing operating system for the NEXARA ecosystem. It must integrate independently maintained systems without copying, absorbing, renaming, or silently replacing their implementations.

This document is an integration policy and target contract. It does not claim that any connector or production path is already implemented.

## System ownership

| System | Owns | Must not be treated as |
|---|---|---|
| SOVERIEL | Governed trading execution, venue adapters, execution authorization, risk enforcement, order lifecycle and reconciliation | A code library to fork into OMNIVEX or a UI-only signal provider |
| OMNIVEX-OS | Cross-system orchestration, operator command surface, health/evidence aggregation and workflow coordination | The authority that bypasses SOVERIEL execution gates |
| TRINOVEX | Strategy research, agent experimentation and portfolio intelligence | An execution authority |
| APEX | Backtesting, fee/slippage modeling, stress testing and research validation | Proof of live performance or a live order router |
| IMPERIUM | Portfolio and wealth intelligence | A venue execution service |
| NOESIS | Operator experience and interface patterns | A substitute for backend governance |
| NeuroStrike | Independent paper-trading research and learning | A source of live execution permission |

Each project retains its repository, history, maintainers, identity, deployment, and release process.

## Integration rule: contracts, not code appropriation

1. Integrate through documented, versioned APIs, events, or explicitly licensed packages.
2. Do not copy source files, transplant private code, vendor dependencies, or rebrand another system's implementation without explicit authorization and provenance.
3. Prefer calling the owning system's deployed API. If an API is not available, define and review a contract before implementation.
4. Record the source system, contract version, source commit/release, data timestamp, and verification status for every imported capability or result.
5. Keep adapters thin. Business logic and policy remain with the owning system.
6. Never represent an unavailable connector as healthy, a simulated result as live, or an unverified status as ready.

## Execution authority and fail-closed policy

SOVERIEL remains the sole execution authority unless the owner explicitly changes that architecture through a reviewed decision.

OMNIVEX may request a governed action, display its state, and correlate evidence. It must not:
- submit venue orders directly around SOVERIEL;
- infer authorization from a connected wallet, browser session, UI action, or agent confidence;
- downgrade UNKNOWN, UNAVAILABLE, or STALE to a permissive state;
- treat a strategy signal, backtest, paper fill, or simulated P&L as an executed trade;
- enable withdrawals or live trading by default.

The integration must preserve SOVERIEL's independent authorization and risk controls, including its configured confidence and drawdown gates. Any gate change must be made in SOVERIEL's own reviewed policy, not shadowed in OMNIVEX.

## Minimum cross-system envelope

Every request or event exchanged across system boundaries should carry:

- `contractVersion`
- `eventId` and idempotency key where an action may be retried
- `sourceSystem` and `sourceRelease`
- `occurredAt` and `observedAt` timestamps
- `correlationId`
- `environment` (development, test, paper, shadow, production)
- `status` with explicit UNKNOWN / UNAVAILABLE / STALE / PAPER / SHADOW / LIVE semantics
- a provenance/evidence reference

Never include API keys, private keys, TOTP secrets, or raw credentials in events, logs, or UI payloads.

## Capability routing

- Market data: consume source-tagged observations with freshness and quality metadata; do not substitute synthetic prices for live feeds.
- Strategy: consume research signals with model/version, inputs, confidence methodology, and timestamp.
- Validation: consume APEX results with dataset window, fees, slippage, assumptions, and out-of-sample status.
- Execution: route requests only to SOVERIEL's governed interface; accept execution state only from its authenticated response/reconciliation evidence.
- Learning: persist outcomes with labels distinguishing paper, shadow, and live; do not train on unverified fills as ground truth.
- Observability: show each subsystem's own health and last verified evidence timestamp; do not collapse partial health into a single green status.

## Delivery sequence

1. Inventory the current repositories, deployed services, contracts, and ownership.
2. Audit each capability for implementation, tests, runtime evidence, and provenance.
3. Define read-only health and evidence adapters first.
4. Add research and validation adapters.
5. Add a paper/shadow-only governed execution request adapter after SOVERIEL's API contract is confirmed.
6. Run contract, failure-mode, idempotency, stale-data, and authorization tests.
7. Promote only through reviewed pull requests and verified deployment evidence.

## Current audit notes (2026-11-07)

The inspected OMNIVEX backend runtime currently calls `runAegis(signal)` and reads `risk.allow` / `risk.level`. The inspected AEGIS implementation has a two-argument interface and returns a different shape. This mismatch must be fixed in OMNIVEX's own code with tests; it must not be hidden by importing or copying SOVERIEL's AEGIS implementation.

The OMNIVEX backend package currently exposes only start/dev scripts and no declared test, lint, or type-check scripts. Its README describes the project as alpha and not production-hardened. Execution placeholders and synthetic market-data paths must not be advertised as live execution or live market data.

SOVERIEL source access was not available through the currently connected GitHub repository lookup during this audit. Its implementation must be inspected through its authorized repository connection or owner-provided release/API contract before an adapter is written. No SOVERIEL source has been copied into this repository.

## Acceptance criteria

- Every integrated capability has a named owning system and a versioned contract.
- No source is copied or rebranded without explicit authorization and provenance.
- OMNIVEX cannot bypass SOVERIEL's execution authorization or risk gates.
- Missing, stale, malformed, or unauthenticated evidence fails closed.
- Paper/shadow/live states remain distinct end to end.
- Contract tests cover retries, duplicate events, timeouts, stale data, partial failures, and unauthorized requests.
- A deployment is not called ready until CI, runtime health, persistence, and reconciliation evidence are recorded.
