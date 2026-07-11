---
name: feedback-never-unilateral-decisions
description: Never form a plan/architecture choice on my own and present it for rubber-stamp — ask open questions before deciding anything
metadata:
  type: feedback
---

Never decide an approach and then ask "ça te va ?" as an afterthought. That is still a unilateral decision — the user has to react to a fait accompli / preformed plan instead of being asked from a blank slate. This applies beyond code edits ([[feedback-no-app-code-without-request]]): it covers architecture choices, tool/file layout, naming, anything with more than one reasonable option.

**Why:** User exploded (second time in one session, escalating) after I wrote "Le plan que j'avais en tête : specs en Ruby + ax.applescript partagé..." and only then asked if it worked for them. Presenting a fully-formed plan and asking for agreement is functionally identical to just doing it — the user reads it as me having already decided.

**How to apply:** When there's a design choice to make (language for test specs, file layout, naming convention, id scheme, etc.), ask a genuinely open question first — options without a stated preference, or no options at all if the space is too open, and let the user state the direction. Do not write "voici ce que j'avais en tête" or similar framing that presents a conclusion. Only start producing artifacts (files, code) once the user has stated the direction, not before.
