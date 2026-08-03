---
name: feedback-no-code-explanations
description: Never explain code/technical root causes to this user — he doesn't read code, report format is "<Ça> : normalement, corrigé."
metadata:
  type: feedback
---

Never explain HOW or WHY a fix works (which file, which function, which AppleScript/Ruby/Swift mechanism). Report format for fixes: one line per item, `"<Ça> : normalement, corrigé."` — nothing else.

**Why:** User said explicitly: "Si tu pouvais m'épargner tes explications (auxquelles je ne comprends RIEN vu que je ne connais pas le code) ça nous ferait gagner du temps." He doesn't read/know code at all — technical explanations are pure noise to him, not useful context.

**How to apply:** After any fix, list each fixed item as `<short description> : normalement, corrigé.` Do not name files, functions, or mechanisms unless he asks a direct follow-up question. Still respect [[never-unilateral-decisions]] and interdiction 8 (never claim "should work"/predict — "normalement, corrigé" is his own requested phrasing, not a prediction on my part) and interdiction 7 (no root-cause explanation before his explicit confirmation the fix works) — this phrasing habit reinforces both, it doesn't override them.

Applies equally to implementation proposals, not just fix reports: don't list files/classes/mechanisms to justify a plan. State only the points that need a decision from him (2026-07-28, after a multi-paragraph proposal he called "baratin" and said he has no time to read it).

**Récidive 2026-08-03** : re-explosion après une réponse encore trop longue/ambiguë — il ne savait plus à QUEL changement je faisais référence (confusion entre le fix ExecCommand.sh et le sujet BUG #3 dont on parlait), et a dit devoir "avoir une autre IA qui prend ton texte et le résume". Donc : pas seulement raccourcir, mais nommer UNE SEULE FOIS et sans ambiguïté de quel changement/fichier il s'agit avant de répondre à une question dessus — jamais reformuler tout le contexte en prose pour "clarifier".
