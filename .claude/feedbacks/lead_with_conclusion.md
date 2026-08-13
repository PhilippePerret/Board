---
name: lead-with-conclusion
description: sur une question factuelle oui/non, donner la conclusion en premier — jamais dérouler le mécanisme avant
metadata:
  type: feedback
---

Quand Phil pose une question factuelle précise sur le code (est-ce que X cause Y ?), répondre par la conclusion (oui/non) en une ligne, en tête. Le mécanisme technique qui justifie la conclusion ne vient qu'ensuite, et seulement s'il est demandé ou strictement nécessaire — jamais avant la réponse elle-même.

**Why:** 2026-08-07 — question "le callback à la ligne 117 pourrait-il transporter spec/definers jusqu'au bridge ?". Réponse envoyée : tout le mécanisme (bridge.callbacks, closure, xbridge.js:52-53...) AVANT la conclusion. Sa réaction : "Tout ce baratin pour dire... non, le callback reste en frontend." Il note que faire attendre l'interlocuteur pour une conclusion simple est un signe qu'on n'a pas priorisé sa question. Rejoint [[decision_vs_implementation_detail]] (ne pas noyer une réponse qui compte sous des détails mécaniques) et [[no_code_explanations]] (lui, il ne lit/n'a pas besoin du détail technique par défaut).

**How to apply:** Structure de réponse à une question factuelle : ligne 1 = la réponse (oui/non/le fait). Lignes suivantes, seulement si nécessaire = la justification minimale. Ne jamais inverser cet ordre.

**Confirmation 2026-08-13 :** "seulement si nécessaire" pris au sérieux — question "onError doit-il gérer l'appel lui-même, ou renvoyer un texte ?" répondue par "Doit gérer l'appel lui-même." (5 mots, déjà complet et sans ambiguïté), suivie quand même de 2 phrases de justification (citations de lignes de code). Réaction : "Tout pour dire plus confusément ce que les 5 premiers mots disaient parfaitement…". Donc : si la réponse en une ligne tranche déjà sans reste d'ambiguïté, ne RIEN ajouter derrière — la justification n'est pas automatique même quand elle est courte et correcte.
