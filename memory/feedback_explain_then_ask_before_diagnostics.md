---
name: feedback-explain-then-ask-before-diagnostics
description: Before running any exploratory/diagnostic command (not just app-code edits), explain what it does in plain terms AND ask permission — don't just run it
metadata:
  type: feedback
---

Before launching any diagnostic/experimental Bash command (osascript probes, AX tree dumps, coordinate-click tests, etc.), even ones that only touch the sandboxed test environment: explain in plain, jargon-free terms what the command will do, then explicitly ask before running it. Don't explain-and-run in the same turn.

**Why:** During a long debugging session on WKWebView accessibility clicking, I kept launching diagnostic osascript/Bash commands one after another to test theories, explaining them only in technical terms embedded in the command comments. User: "tu peux m'expliquer ce que tu fais ????" then, after I explained, "la prochaine fois... tu EXPLIQUES avant de te lancer dans le code, et même : tu DEMANDES". This compounds [[feedback-never-unilateral-decisions]] and [[feedback-no-app-code-without-request]] — the same principle (no unilateral action) extends to read-only/sandboxed diagnostic commands, not just app-code edits or architecture decisions.

**How to apply:** Any time about to run a Bash/osascript command whose purpose isn't already obvious from the immediately preceding conversation, write a short plain-language summary of what it does and why, then ask "je lance ?" (or equivalent) and wait for a yes before calling the tool. This applies even when the command is non-destructive/sandboxed — the issue is being kept in the loop, not just safety.
