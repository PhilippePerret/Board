---
name: project-test-engines-status
description: Four AX-driven test engines exist for benchmarking (base/batch/compiled/pers) — status and known gotchas as of 2026-07-10
metadata:
  type: project
---

`./run-tests [pattern] -v <engine>` (default `base`) drives `Tests/version-<engine>/run_tests.sh`, which dispatches via `Tests/support/helpers.rb` reading `BOARD_TEST_ENGINE`. All four share `Tests/support/ax.applescript` (click/wait-for/get-text/order-of/batch actions by `AXDOMIdentifier`) except `pers`, which ports the same logic to JXA (`Tests/version-pers/support/ax_server.js`).

- **base** — one `osascript` process per action. Reference/unchanged engine.
- **batch** — queues fire-and-forget actions (click/set_value), flushes as one `osascript batch` call before any getter. Measured gain: ~0 in practice, because the real specs almost never queue 2+ actions before a getter (each click is immediately followed by a wait_for).
- **compiled** — same `ax.applescript`, precompiled once via `osacompile` to `support/ax.scpt`. Measured gain: ~5% per call — proves AppleScript *parsing* isn't the bottleneck.
- **pers** — one long-lived JXA process (`osascript -l JavaScript`) talking to Ruby over a bidirectional pipe (JSON lines), instead of a process spawn per action. Fastest measured (~1.2s/call vs ~1.4-1.5s for the others), but required several live-only-discoverable fixes: `delay` is a non-redefinable JXA global (renamed to `pauseBriefly`), `IO#close` on a stuck child process blocks forever (must `Process.kill('KILL', pid)` + `Process.wait` *before* `close`), and `pipe.gets` needs an explicit `IO.select` timeout (no timeout by default → hangs forever on a stuck child).

Dominant cost across all engines: the `System Events`-driven recursive AX-tree walk itself (`findByDomId`/`findByDomIdPrefix`), not process-spawn or script-parse overhead — confirmed by `compiled`'s marginal gain despite eliminating parse cost entirely.

See [[feedback-backup-volatile-tmp]] and [[feedback-finder-window-closing-safety]] for unrelated but adjacent incidents from the same session (real user data loss, Finder window safety) that happened while building/debugging this test infra.
