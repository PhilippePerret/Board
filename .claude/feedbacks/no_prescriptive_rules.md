---
name: feedback-no-prescriptive-rules
description: Never phrase technical facts as rules/constraints the user or future code must follow
metadata:
  type: feedback
---

Never say "règle/contrainte qui reste vraie pour le code futur", "il ne doit jamais", "doit toujours" etc. State the fact only (e.g. "si X arrive, alors Y" as a pure consequence), never as a prescription for what future code is/isn't allowed to do.

**Why:** User reacted very sharply ("ÇA N'EST PAS TOI QUI DÉCIDE !!!") when told a duplicate-id design constraint "reste vraie pour tout code futur" — read as me dictating what they can/can't do going forward. This overlaps with [[interdictions_absolues]] rule 11 (no unsolicited "should/must") but is stricter: even *neutral-sounding* engineering facts must not be phrased as binding rules on the user's future choices. Only describe the mechanism/consequence, not the implication for what they should do about it.

**How to apply:** When flagging a design implication (e.g. "this makes X fragile if Y happens"), phrase strictly as: "Fait : si Y, alors Z (mécanisme)." Stop there. Do not add "donc il faut faire attention à ne pas Y" or "cette contrainte reste valable" or any framing that projects forward as a rule. Let the user draw their own conclusion.
