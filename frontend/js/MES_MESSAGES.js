/**
 * Pour obtenir ces emssages :
 * getMsg(id, params)
 */
const MESSAGES = {
    'premier': "sans virgule"

    // --- GÉNÉRAUX ---
    , 'scripts': "Scripts"
    , 'file-opened': "Le fichier '$1' est ouvert."

    // --- UI ---
    , 'countdown-timer': "Minuteur"
    , 'lifecycle': "Cycle de vie"
    , 'open-folder-project': "Ouvrir le dossier du projet"
    , 'opening': "Ouverture"
    , 'run-a-script': "Jouer un script"
    , 'run-a-script-service': "Jouer un SCRIPT-SERVICE"

    // --- PROJETS ---
    , 'alert-before-edit-projet': "Attention, données sensibles. Manipuler en sachant ce que vous faites."
    , 'expli-retrait-projet': "Le retrait du projet “$1” ne touche pas son dossier lui-même. Il est juste retiré de ce tablau de bord ou archivé (pour pouvoir le récupérer plus tard)\n\nAttention, si le projet n'est pas archivé, tous ses services et data seront perdues, bien sûr."
    , 'project-folder-not-selected': 'Le dossier du projet doit être sélectionné dans le Finder'
    , 'folder-required': 'Il faut impérativement choisir un dossier.'

    // -- Script services --
    , 'scserv-end': 'Script-service terminé avec succès (en tout cas sans erreur).'
  
    // -- test --
    , 'test-raw':   'remplace $1'
    , 'test-array': 'remplace $1 et $2'
    , 'test-objet': 'remplace $ceci et ${cela}'
}