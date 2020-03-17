module.exports = (url, blockId) => {
  const BASE = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://potion-api.now.sh"

  return `${BASE}/api/asset?url=${encodeURIComponent(url)}&blockId=${blockId}`
}