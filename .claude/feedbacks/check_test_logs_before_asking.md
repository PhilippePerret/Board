---
name: check_test_logs_before_asking
description: état des tests = toujours vérifiable via Tests/resultats/*.log avant de questionner Phil
metadata:
  type: feedback
---

Avant de demander à Phil "quels tests échouent encore" ou de reprendre un test un par un sur la liste périmée d'un état de fin de session, lire d'abord les logs les plus récents dans `Tests/resultats/*.log` (triés par date de fichier).

**Why:** l'état de fin de session se périme vite (tests corrigés dans une session suivante sans que le fichier soit mis à jour) ; Phil a explosé de colère (2026-08-15) parce que je proposais de retester des tests déjà passés, puis parce que je lui demandais de me redonner la liste alors que l'info était disponible localement dans les logs.

**How to apply:** dès qu'une liste de tests à investiguer est reprise d'un fichier `.claude/*-Etat-fin-de-session.md`, croiser chaque entrée avec le dernier log `Tests/resultats/` la concernant avant d'agir ou de questionner. Ne garder dans la liste que ce qui est confirmé encore rouge par le run le plus récent.
