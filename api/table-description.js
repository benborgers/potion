/* Return the description of a Notion collection */

const call = require("../notion/call")
const normalizeId = require("../notion/normalizeId")
const textArrayToHtml = require("../notion/textArrayToHtml")

module.exports = async (req, res) => {
  const { id:queryId } = req.query
  const id = normalizeId(queryId)

  if(!id) {
    return res.json({
      error: "no Notion doc ID provided as `id` parameter"
    })
  }

  const pageData = await call("getRecordValues", {
    requests: [
      {
        id: id,
        table: "block"
      }
    ]
  })

  if(!pageData.results[0].value) {
    return res.json({
      error: "invalid Notion doc ID, or public access is not enabled on this doc"
    })
  }

  if(!pageData.results[0].value.type.startsWith("collection_view")) {
    return res.json({
      error: "this Notion doc is not a collection"
    })
  }

  const collectionId = pageData.results[0].value.collection_id
  const collectionViewId = pageData.results[0].value.view_ids[0]

  const tableData = await call("queryCollection", {
    collectionId,
    collectionViewId,
    loader: {
      type: "table"
    }
  })

  const descriptionArray = tableData.recordMap.collection[collectionId].value.description

  res.send(textArrayToHtml(descriptionArray))
}