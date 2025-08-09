export function createPageUrl(pageName) {
  // Accept values like "Chat?caseId=..." or just "Cases"
  if (!pageName) return '/'
  const [name, query] = String(pageName).split('?')
  const path = '/' + name.toLowerCase()
  return query ? `${path}?${query}` : path
}