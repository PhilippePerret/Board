function getErr(idMessage, params) {
  return ERRORS[idMessage]
}

const ERRORS = {
    'project-folder-not-selected': 'Le dossier du projet doit être sélectionné dans le Finder'
  , 'folder-required': 'Il faut impérativement choisir un dossier.'
}