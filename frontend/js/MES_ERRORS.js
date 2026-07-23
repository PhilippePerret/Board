/**
 * 
 * Définition des erreurs
 * 
 * Usage
 * 
 *  getErr(errId, params)
 */
const ERRORS = {
    'premier': 'pour-virgule'
    // --- Données générales ---
  , 'invalid-phone-number': "Le numéro de téléphone $1 est invalide."
    // --- Projets ---
  , 'project-folder-not-selected': 'Le dossier du projet doit être sélectionné dans le Finder.'
  , 'folder-required': 'Il faut impérativement choisir un dossier.'

    // Scripts services
  , 'scserv-abort': "Abandon du service"
  , 'scserv-unknown-step': "L'étape d'identifiant '$1' est inconnue."
  , 'scserv-list-required': "Le fichier YAML devrait définir une liste d’étapes ($1)."
  , 'scserv-type-required': "Une étape de script-service ($1) doit toujours avoir un type ($2)."
  , 'scserv-id-required': "Une étape de script-service doit absolument avoir un identifiant ($1)."
  , 'scserv-id-invalid': "L’identifiant de l'étape $1 n'est pas valide ($2)."
  , 'scserv-step-type-unknowned': "type d’étape inconnu : $1 ($2)."
  , 'scserv-param-required': "Le paramètre '$1' est requis, pour le type '$2' ($3)."
  , 'scserv-unknown-param': "Le paramètre '$1' est inconnu du service de type '$2' ($3)."
  , 'scserv-param-bad-type': "Le paramètre '$1' n'a pas le bon type. Attendu: $2, actuel: $3 ($4)."
  , 'scserv-on-get-file-values': "Une erreur s'est produite en essayant de relever les données du fichier '$1' : $2 ($3)."
  , 'scserv-select-with-object-requires-key-values': "Le select de l'étape $1 dont les données sont des tables nécessite le paramètre key_values définissant la valeur du menu ($2)"
  , 'scserv-select-with-object-requires-title-values': "Le select de l'étape $1 dont les données sont des tables nécessite le paramètre title_values définissant le titre du menu ($2)"
  , 'scserv-select-with-object-unknown-key': "Pour le select de l'étape $1, l'objet $2 ne définit pas la clé '$3' pour la valeur ($4)."
  , 'scserv-select-with-object-unknown-title': "Pour le select de l'étape $1, l'objet $2 ne définit pas la clé '$3' pour le titre ($4)."
  , 'scserv-unknown-evaluator': "L'évaluator de l'étape '$1' est inconnu : $2 ($3)."
}