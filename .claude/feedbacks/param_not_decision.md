---
name: feedback-param-not-decision
description: Don't ask the user to pick a fixed value for something that's obviously a per-call parameter
metadata:
  type: feedback
---

Before asking an open question to resolve a "decision", check whether the thing is actually a fixed choice or just a parameter that varies per call. "What's the auto-close delay?" / "text only or with buttons?" are not decisions — they're call-site parameters (`data.delay`, `data.buttons`).

**Why:** Asked Phil to pick one value for delay and panel content while building `Notifier` (2026-07-28). Answer: "Parfois oui, parfois non" for both — obvious in hindsight, these vary by call, not global constants. He called the questions "débiles".

**How to apply:** [[never_unilateral_decisions]] still holds for real architecture/behavior choices. But if a question's honest answer would be "depends on the call", it's not a decision to ask about — just add it as an optional param with a sensible default and move on.
