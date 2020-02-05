/* Normalize a UUID for use in Notion's API */

module.exports = (id) => {
  if(!id) return id
  if(id.length === 36) return id // Already normalized
  return `${id.substr(0, 8)}-${id.substr(8, 4)}-${id.substr(12, 4)}-${id.substr(16, 4)}-${id.substr(20)}`
}