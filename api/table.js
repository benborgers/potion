/* Return the entries of a table in Notion */

const call = require("../notion/call")
const normalizeId = require("../notion/normalizeId")

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

  if(pageData.results[0].value.type !== "collection_view_page") {
    return res.json({
      error: "this Notion doc is not a full-page collection"
    })
  }

  const collectionId = pageData.results[0].value.collection_id
  const collectionViewId = pageData.results[0].value.view_ids[0]
  

  const tableData = await call("queryCollection",{
    collectionId,
    collectionViewId,
    loader: {
      type: "table"
    }
  })

  const subPages = tableData.result.blockIds

  const schema = tableData.recordMap.collection[collectionId].value.schema

  const output = []

  subPages.forEach(id => {
    const page = tableData.recordMap.block[id]

    const fields = {}

    for(const s in schema) {
      const schemaDefinition = schema[s]
      let value = page.value.properties[s] && page.value.properties[s][0][0]

      if(schemaDefinition.type === "checkbox") {
        value = value === "Yes" ? true : false
      } else if(value && schemaDefinition.type === "date") {
        value = page.value.properties[s][0][1][0][1]
      }

      fields[schemaDefinition.name] = value || undefined
    }

    output.push({
      fields, 
      id: page.value.id,
      emoji: page.value.format && page.value.format.page_icon,
      created: page.value.created_time,
      last_edited: page.value.last_edited_time
    })
  })


  return res.json(output)
}