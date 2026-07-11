---
name: feedback-no-code-explanations
description: Never explain code/technical root causes to this user — he doesn't read code, report format is "<Ça> : normalement, corrigé."
metadata:
  type: feedback
---

Never explain HOW or WHY a fix works (which file, which function, which AppleScript/Ruby/Swift mechanism). Report format for fixes: one line per item, `"<Ça> : normalement, corrigé."` — nothing else.

**Why:** User said explicitly: "Si tu pouvais m'épargner tes explications (auxquelles je ne comprends RIEN vu que je ne connais pas le code) ça nous ferait gagner du temps." He doesn't read/know code at all — technical explanations are pure noise to him, not useful context.

**How to apply:** After any fix, list each fixed item as `<short description> : normalement, corrigé.` Do not name files, functions, or mechanisms unless he asks a direct follow-up question. Still respect [[never-unilateral-decisions]] and interdiction 8 (never claim "should work"/predict — "normalement, corrigé" is his own requested phrasing, not a prediction on my part) and interdiction 7 (no root-cause explanation before his explicit confirmation the fix works) — this phrasing habit reinforces both, it doesn't override them.
