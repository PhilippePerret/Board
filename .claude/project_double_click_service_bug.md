---
name: project-double-click-service-bug
description: "[BUG] clicking an attached service twice does nothing the second time — open investigation, AXPress-driven test cannot reproduce it"
metadata:
  type: project
---

`Tests/_tests_a_faire.adoc` lists (as "[BUG] On peut cliquer deux fois sur le même service") — clicking a project's attached service (e.g. `open-folder-project`, which opens a Finder window via `backend/scripts/OpenFolderProject.scpt`) works the first time but appears to do nothing on a second real click, even with the folder closed in between.

**Status as of 2026-07-10:** `Tests/specs/e2e/execution_double_service.rb` (AXPress-driven double click, via `BoardTest#click_service_and_wait_folder`) passes reliably — confirmed via `backend/lib/debug.rb`'s `Debug.log` (added to the `exec-service` backend handler, writes to `~/Library/Application Support/Board-debug.log`, survives outside the test's data dir) that BOTH synthetic clicks reach the backend and both `OpenFolderProject.scpt` runs return `ok: true`. This means AXPress cannot reproduce whatever breaks a real second click — the bug lives somewhere between a genuine mouse click and the JS handler firing, a code path AXPress never exercises (it's a discrete accessibility "press" action, not a mouse-down/up sequence).

One hypothesis tried and disproven by the user directly: that a real click's tiny mouse movement on the `draggable=true` service card incidentally fires `dragstart`→`dragend` with `dropEffect=="none"`, triggering `Project.js`'s `removeServiceFromListe()`. Wrong on two counts: the removal would be visually obvious (user would have seen it), and `dropEffect` only becomes `"none"` if the drag ends *outside* a valid drop zone — a click-sized jitter stays inside the same container.

**Next step (not done yet):** the WKWebView dev console stays open for the life of the app session (it only closes when the app quits) — user needs to open it and watch `console.log` output from `ServiceExecuter`/`Services.js` during a live real double-click, to see how far the second click's event actually propagates. Not something this agent can do — requires live interactive observation.
