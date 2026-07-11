---
name: project-test-engines-status
description: Test engine history — base/batch/compiled/pers benchmarked and retired 2026-07-11, swift (AXUIElement direct) and pont (WKWebView JS bridge) kept, pont fastest and default
metadata:
  type: project
---

`./run-tests [pattern] -v <engine>` (default `pont`) drives `Tests/version-<engine>/run_tests.sh`, dispatched via `Tests/support/helpers.rb` reading `BOARD_TEST_ENGINE`. Only `swift` and `pont` remain (2026-07-11) — `base`/`batch`/`compiled`/`pers` deleted after benchmarking confirmed they were both slower and (for `batch`) less reliable; `Tests/support/helpers_base.rb` stayed (shared base module `swift`/`pont` both build on, not tied to the deleted "base" engine dir).

**Why the first four were retired:** all four drove Board through System Events/AppleScript AX-tree walks (`Tests/support/ax.applescript` or its JXA port) — the dominant cost was always the recursive AX-tree walk itself (`findByDomId`), not process-spawn or script-parse overhead (`compiled`'s ~5%-only gain from precompiling proved that). Full-suite benchmark (11 specs, 2026-07-11): base 152s, batch 228s (6 failures — its action queue only flushes on AX getters, not Finder-side checks like `finder_front_window_name`, so a queued click before a Finder-window wait can execute too late or not at all), compiled 153s, pers 142s, vs swift 49s / pont 49s — roughly 3x faster, decisive enough that fixing batch's bug wasn't worth the effort.

- **swift** — `Tests/version-swift/support/ax_helper.swift`, a compiled binary calling AXUIElement directly (no System Events middleman). Needs its own Accessibility permission grant (tied to the binary's path, separate from osascript's). `boardPid()` uses `pgrep` (not `NSWorkspace.runningApplications`, which needs a pumped run loop the helper never has — caused false "btn-add-project introuvable" timeouts right after `launch_app` relaunches Board mid-spec).
- **pont** — `Sources/Board/TestBridge.swift`, a Unix-socket JSON bridge baked into Board itself, evaluating JS directly in the WKWebView (`evaluateJavaScript`) — bypasses accessibility entirely. Needs `open --env BOARD_TEST_BRIDGE_SOCKET=...` (not plain `open`) whenever `launch_app` relaunches Board mid-spec, since `open` doesn't propagate the calling shell's env to the launched app. `click`/`click_prefix` must dispatch a real mousedown+mouseup+click sequence, not just `el.click()` — project-card selection listens for `mousedown` (`Project.js` `onMouseDown`), which `.click()` never fires. JS booleans come back from `evaluateJavaScript` as `NSNumber` — stringifying naively gives `"1"`/`"0"`, not `"true"`/`"false"`, silently breaking every `exists?`-style check until special-cased.

`Tests/benchmark.sh` runs one spec (or `--all`) across both remaining engines and prints a comparison table.

See [[feedback-backup-volatile-tmp]] and [[feedback-finder-window-closing-safety]] for unrelated but adjacent incidents from the same 2026-07-10 session (real user data loss, Finder window safety) that happened while building/debugging this test infra.
