---
name: project-webkit-ax-flattening
description: WKWebView/WebKit can drop a plain wrapper <div> entirely from the macOS accessibility tree — role="group" fixes it
metadata:
  type: project
---

A `<div>` that contains only other elements (no direct text of its own) can be completely absent from WebKit's accessibility tree in a WKWebView — not just missing its `id`/`AXDOMIdentifier`, the node itself doesn't exist at all. Its children get promoted to appear as direct children of the nearest ancestor that *is* exposed (e.g. a card's title/path/dates ended up as flat siblings directly under `#project-cards-container`, with no intermediate node for the card itself).

**Fix confirmed working:** adding `role="group"` to the div (via `DCreate(..., {role: 'group'})` in `frontend/js/Dom.js`'s generic `setAttribute` fallback) makes WebKit expose it as a distinct `AXGroup` node with its `AXDOMIdentifier` intact, clickable via `System Events`.

**How this was found:** [[Tests/support/ax.applescript]]'s `exists`/`click` actions (AXDOMIdentifier-based, see the Board project's test suite) returned `false`/timeout for `div#project-<id>` (the project card) even though the id was verified present in the live DOM. Confirmed via direct `AXParent` traversal from a reachable child (the title) that the parent was the whole list container, not the card — proof the card node itself was absent from the tree, not just unlabeled.

**How to apply:** if a future test can't find/click a DOM element by id via the accessibility tooling despite the id being correct in the HTML, and that element is a plain structural wrapper with no direct text, try `role="group"` (or another semantic ARIA role) on it first before assuming the test tooling is broken.
