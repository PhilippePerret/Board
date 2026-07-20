---
name: 2026-07-19-etat-fin-de-session
description: état daté 2026-07-19 — redimensionnement horloge (meta+glisser) écrit mais jamais compilé/testé, quelques petits trucs signalés par l'user restent à éclaircir demain
metadata:
  type: project
---

- Service `open-file` + type param `logiciel` + redéfinition (cmd+clic) de service attaché : fait, testé, tous les tests passent.
- Lien "Aide" (fenêtre native, `HelpWindow.swift`) : fait, crash corrigé (`isReleasedWhenClosed`), test écrit.
- Redimensionnement de l'horloge (meta+glisser, `Clock.js`/`clock.css`) : écrit, PAS compilé, PAS testé en live, aucun test e2e écrit.
- User : "quelques petits trucs qui ne vont pas" — pas précisés, à demander/creuser à la reprise.
