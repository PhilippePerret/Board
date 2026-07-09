---
name: feedback-macos-icons-padding
description: macOS icons must have transparent padding around the squircle — squircle does not fill the full canvas
metadata:
  type: feedback
---

macOS app icons have transparent margin around the squircle background. The squircle must NOT fill the entire canvas.

**Why:** macOS icon design guidelines — the background shape leaves breathing room from canvas edges.

**How to apply:** For a 512x512 SVG canvas, place squircle at ~x=20, y=20, w=472, h=472 (or similar margin), leaving transparent space around it. Never use x=0, y=0, w=512, h=512 for the background rect.
