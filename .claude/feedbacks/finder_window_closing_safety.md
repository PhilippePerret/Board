---
name: feedback-finder-window-closing-safety
description: Test helpers that close Finder windows must verify the exact target (by name) immediately before closing, and never sweep/close by tracked-id-diff or broad iteration
metadata:
  type: feedback
---

Several iterations of `Tests/support/finder.applescript` closing logic risked (or the user believed risked) closing Finder windows unrelated to the test — including the user's own personal windows open for unrelated work during a test run.

**Why:** User explicitly forbids closing "all" Finder windows or windows not proven to be the test's own, twice, in escalating terms ("il est impensable de fermer toutes les fenêtres... je travaille sur d'autres choses" then "VIRE-MOI ÇA TOUT DE SUITE"). Root causes tried and discarded, in order: (1) matching by POSIX path — broke silently on macOS symlink resolution (`/var` vs `/private/var`); (2) `repeat with w in windows ... close w` — mutating the collection mid-iteration; (3) closing by path-match generally — replaced entirely with front-window-by-name, since `OpenFolderProject.scpt` does `activate` + `make new Finder window`, guaranteeing the new window is frontmost right after the action that opened it. Even then, `with_finder_selection`/`with_finder_deselected` (pre-existing helpers using before/after window-id diffing to decide what to close) were removed entirely rather than fixed, at the user's explicit request, after full-suite runs still reported "all Finder windows" closing.

**How to apply:** Any helper that closes a Finder window must (a) target a single window, (b) verify its identifying property (name, not path) matches the expected value in the same call that closes it — not just at an earlier open-verification step — and (c) do nothing (not raise, not sweep) if the check fails. Prefer no cleanup over broad/tracked-diff cleanup when in doubt; the user would rather have a few leftover windows than lose one of their own.
