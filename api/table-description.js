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

  const {recordMap} = await call("loadPageChunk", {
    requests: [
      {
        id: id,
        table: "block",
        version: -1
      }
    ]
  });

  const collectionBlock = recordMap.block[id].value;

  if(!collectionBlock) {
    return res.json({
      error: "invalid Notion doc ID, or public access is not enabled on this doc"
    })
  }

  if(!collectionBlock.type.startsWith("collection_view")) {
    return res.json({
      error: "this Notion doc is not a collection"
    })
  }

  const descriptionArray = recordMap.collection[collectionBlock.collection_id].value.description;

  res.send(textArrayToHtml(descriptionArray))
}
