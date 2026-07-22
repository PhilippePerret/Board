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
    // --- Projets ---
  , 'project-folder-not-selected': 'Le dossier du projet doit être sélectionné dans le Finder.'
  , 'folder-required': 'Il faut impérativement choisir un dossier.'

    // Scripts services
  , 'scserv-list-required': "Le fichier YAML devrait définir une liste d’étapes ($1)."
  , 'scserv-type-required': "Le service '$1' doit toujours avoir un type ($2)."
  , 'scserv-id-required': "Un script-service doit absolument avoir un identifiant ($1)."
  , 'scserv-id-invalid': "L’identifiant $1 n'est pas valide ($2)."
  , 'scserv-step-type-unknowned': "type d’étape inconnu : $1 ($2)."
  , 'scserv-param-required': "Le paramètre '$1' est requis, pour le type '$2' ($3)."
  , 'scserv-unknown-param': "Le paramètre '$1' est inconnu du service de type '$2' ($3)."
  , 'scserv-param-bad-type': "Le paramètre '$1' n'a pas le bon type. Attendu: $2, actuel: $3 ($4)."
}