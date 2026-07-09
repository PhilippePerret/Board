function getMsg(idMessage, params) {
  return textSubstitute(MESSAGES[idMessage], params)
}


const MESSAGES = {
    'test-raw': 'remplace $1'
  , 'test-array': 'remplace $1 et $2'
  , 'test-objet': 'remplace $ceci et ${cela}'
  , 'project-folder-not-selected': 'Le dossier du projet doit être sélectionné dans le Finder'
  , 'folder-required': 'Il faut impérativement choisir un dossier.'
}

const TESTS  = [
  ['test-raw', 'ça', 'remplace ça'],
  ['test-raw', 12, 'remplace 12'],
  ['test-array', ['ceci', 'cela'], 'remplace ceci et cela'],
  ['test-objet', {ceci: 'oui ceci', cela: 'oui cela'}, 'remplace oui ceci et oui cela'],
]

/*
var errorCount = 0, id, params, expected;
for (var k in TESTS) {
  [id, params, expected] = TESTS[k]
  const actual = getMsg(id, params)
  if (actual != expected) {
    ++errorCount
    console.error("Problème de substitution", id, expected, actual)
  }
}
if (errorCount == 0) console.info("Tous les tests substitution sont passés.")
  //*/