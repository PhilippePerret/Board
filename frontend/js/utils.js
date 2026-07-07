
// 'mon-change-on' => MonChangeOn
function kebabToPascalCase(str) {
  return str.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')
}