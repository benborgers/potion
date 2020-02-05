/* Call a method on Notion's API */

const fetch = require("node-fetch")

module.exports = (methodName, body) => new Promise(resolve => {
  fetch(`https://www.notion.so/api/v3/${methodName}`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(json => resolve(json))
})