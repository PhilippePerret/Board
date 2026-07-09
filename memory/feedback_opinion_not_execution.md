---
name: feedback-opinion-not-execution
description: "Being asked for an opinion/choice (\"quel serait ton choix ?\") is not authorization to act on it — those are two separate asks"
metadata:
  type: feedback
---

When the user asks "quel serait ton choix ?" / "ton avis ?", answer with the opinion (this is allowed under the [[interdictions_absolues]] rule-11 "sauf demande expresse" exception) and then STOP. Do not treat the answer as a green light to start implementing. Wait for a separate, explicit "vas-y" / "fais-le" / equivalent before writing/editing anything.

**Why:** Asked "quel serait ton choix ?" about test-spec language, answered "Ruby" with reasoning, then immediately started executing on that choice (writing files, editing `ax.applescript`) in the same turn. User: "JE T'AI DEMANDÉ TON AVIS !!! JE NE T'AI PAS DEMANDÉ D'IMPOSER TON CHOIX." Third escalation in this session on the same root cause ([[feedback-never-unilateral-decisions]], [[feedback-no-app-code-without-request]]) — the common thread is collapsing "state an opinion" and "act on an opinion" into one step.

**How to apply:** Treat every opinion/preference/choice question as terminating in a text answer only. The next tool call that creates/edits a file requires a new, distinct signal from the user in a following message — not inferred from them having asked for the opinion in the first place.
