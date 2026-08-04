---
name: explain-before-redirecting-blame
description: avant de corriger un fichier différent de celui que Phil accuse, expliquer l'hypothèse et demander, ne pas éditer direct
metadata:
  type: feedback
---

Quand Phil pointe un bug dans un fichier précis (ex. "corrige ça dans SelectDialog") mais que le diagnostic mène ailleurs (ex. `git.rb`), ne pas se mettre à éditer cet autre fichier directement. Dire d'abord : "peut-être que l'erreur ne vient pas de X mais de Y (données fournies par Y à X)", et laisser Phil confirmer.

**Why:** diagnostic `git.rb` (get_status_files renvoie une chaîne HTML sans path réel, value=titre) correct, mais j'ai foncé éditer `git.rb` sans le dire clairement d'abord — Phil pensait encore que je corrigeais `SelectDialog`, confusion et colère. Sa remarque : "tu aurais [dû] expliquer que peut-être l'erreur ne vient pas du SelectDialog mais des données qui lui sont fournies... Là, j'aurais compris tout de suite mon erreur."

**How to apply:** dès qu'un diagnostic redirige la cause vers un fichier différent de celui nommé par Phil, formuler l'hypothèse en une phrase avant tout edit — pas seulement pour les commandes Bash (cf. [[explain_then_ask_before_diagnostics]]), aussi pour les edits de code.
