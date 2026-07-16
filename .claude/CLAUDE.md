# CLAUDE.md

## Consignes

- Parler à l'user en FRANÇAIS
- l'user s'appelle Phil
- OBLIGATOIRE en début de session : lire `.claude/MEMORY.md`. Traiter en premier toute entrée marquée "PRIORITÉ" (avant tout le reste). Une fois une entrée PRIORITÉ lue et prise en compte, la retirer de `.claude/MEMORY.md` et supprimer le fichier `.claude/project_*.md` qu'elle référence — ne pas la laisser traîner.

## Présentation

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Board — native macOS app (Swift/Cocoa/WebKit shell) for managing setup of multiple front-end dev projects. It shows a panel of project cards; each card has buttons to run "services" (open a Finder window at a given position, bump a versioned file's version, run a custom script, open in VSCode, etc). See `_dev/Manuel/adocs/presentation.adoc` for the full pitch (in French).

## Build & run

```
./build.sh              # clean build: swiftc compile + assemble Board.app bundle, then opens it
./run_build.command      # same, double-clickable from Finder
./update.command         # fast path: copies frontend/ and backend/ into the already-built Board.app, relaunches, opens Safari Web Inspector on it
```

There is no separate lint/test command — `Tests/` currently contains no test files.

`swiftc` compiles directly (`Sources/Board/*.swift -framework Cocoa -framework WebKit`), no Xcode project/SPM package involved.

## Architecture

Three layers, talking over a JSON message bridge:

1. **Swift shell** (`Sources/Board/`) — a Cocoa `NSWindow` hosting a `WKWebView` that loads `frontend/index.html` from the app bundle.
   - `AppDelegate.swift` — window/menu setup.
   - `ViewController.swift` — creates the `WKWebView`, wires up `Bridge` as a `WKScriptMessageHandler` under the JS message handler name `"bridge"`, injects backend responses back into the page via `window.bridge.receive(...)`.
   - `Bridge.swift` — receives a JS message body, serializes it to JSON, hands it to `Backend.run`, sends the JSON string response back to JS.
   - `Backend.swift` — spawns `backend/backend.rb` as a subprocess (via a hardcoded rbenv Ruby: `~/.rbenv/versions/3.4.7/bin/ruby`), writes the JSON request to stdin, reads the JSON response from stdout synchronously.

2. **Ruby backend** (`backend/backend.rb` + `backend/lib/usefull.rb`) — a single-shot script: reads one JSON request from stdin, dispatches on `request["action"]` (`load`, `save-project`, `remove-project`, `run-osascript`, `run-bashscript`, `exec-service`, `getInfoFinderSelection`, `getInfoFinderWindow`), writes one JSON response to stdout, exits. Every bridge call = one fresh Ruby process (not a long-lived server). `backend/lib/usefull.rb` holds the shared setup: `APP_FOLDER`, `DATA_SUPPORT_FOLDER` (`~/Library/Application Support/Board`), `PROJECT_CARD_FOLDER` (`.../Board/project-cards`), `APP_DATA`/`APP_DATA_FILE` (`.../Board/appdata.json`, JSON, tracks `projects-in`/`projects-out` project id lists), `project_path(id)`, `save_app_data`, `run_script`, `human_date_to_aaammjj`. Project cards are YAML files under `PROJECT_CARD_FOLDER`, one per id (no `.yaml` extension on the filename — `project_path` returns a bare id path).

3. **Frontend** (`frontend/js/`, plain JS, no framework/bundler, no Promises — see "no-Promise" convention below):
   - `xbridge.js` — `window.bridge` (postMessage/receive plumbing keyed by generated request ids + per-call callbacks) and `window.server.send(data, callback)` as the app-facing API.
   - `Project.js` — project card model/rendering/CRUD.
   - `Service.js`, `ServiceData.js`, `ServiceDefiner.js`, `ServiceExecuter.js`, `ServicePanel.js`, `SidePanel.js`, `ServicesTools.js` — the services system (see below).
   - `Dialog.js`, `Dialogs.js`, `Dom.js`, `Dashboard.js`, `utils.js`, `app.js` — UI plumbing/dialogs/misc.
   - Scripts are loaded via plain `<script>` tags in `index.html` (order matters — no module system).

### The services system

A **service** is an operation that can be attached to a project (open a Finder window, bump a version number, run an arbitrary script, etc). Full spec: `_dev/Manuel/adocs/xdev/definition-services.adoc`.

- All services are declared in `frontend/js/ServiceData.js`, split across two arrays: `CUSTOM_SERVICES_DATA` and `COMMON_SERVICES_DATA` (merged into `ALL_SERVICES_DATA` for id-based lookups, e.g. dynParams resolution in `ServiceExecuter.js`). Each entry has `id`, `name`, `params` (fixed params, defined when the service is attached to a project), optionally `dynParams` (dynamic params, asked at run time), optionally `scType` (script extension if not AppleScript, e.g. `.rb`) and `paramsOrder` (needed when a param type expands to several backend args, e.g. `finder-window`).
- Single `Service` class (`Service.js`) for both custom and common services — no subclassing. Which array a service comes from sets its `stype` (`'custom'`/`'common'`), injected at panel-build time (`ServicePanel.js`). A common service (`stype == 'common'`) additionally gets a click listener on its panel button to run it directly on the current project (`Service#execCommonServiceOn`); a custom service only supports drag-and-drop onto a project.
- Each panel (`#common-services-panel` / `#custom-services-panel`) is a `SidePanel` subclass (`ServicePanel.js`: `CommonPanel`/`CustomPanel`), built dynamically and appended to `document.body` — not the static markup in `index.html`.
- A service has two states: **abstract** (in `ALL_SERVICES_DATA`, identified by `id`) vs **concrete** (attached to a project, identified by `uuid`, `params` becomes a flat ordered list of values rather than a keyed table). A common service run directly by click (not attached to a project) instead stores its params in `project.sdata[id]`, not in `project.services`.
- Each service `id` maps to a **backend script** in `backend/scripts/`, named by camelizing the id (`file-versioning` → `FileVersioning.rb`). The script receives its params positionally, as strings, with no indication of what they are — order comes from declaration order in `ServiceData.js`, or from `paramsOrder` (for user info only) if a param type expands to multiple values.
- Editing `ServiceData.js` requires running `update.command` to push the change into the built app bundle.
- Simple OS-level actions can skip a dedicated script by using `exec-service` with `run-osascript` / `run-bashscript` against a script already in `backend/scripts/`.

## Conventions

- **No Promises.** The frontend deliberately uses callback-style async (see `_dev/Manuel/adocs/xdev.adoc`) — keep that pattern when adding bridge calls.
- **`Board.app/Contents/Resources/{frontend,backend}` is committed to git alongside the `frontend/`/`backend/` sources** — it's the copy `update.command`/`build.sh` sync into the app bundle. When editing frontend/backend code, expect the diff to show up twice (source + bundled copy) unless you run the sync script.
- Everything user-facing and in comments/docs is French; keep new UI strings and doc comments in French to match.
