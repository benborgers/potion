/* Return the entries of a table in Notion */

const call = require("../notion/call")
const normalizeId = require("../notion/normalizeId")
const textArrayToHtml = require("../notion/textArrayToHtml.js")
const getAssetUrl = require("../notion/getAssetUrl")

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
    query: {},
    loader: {
      type: 'table',
      limit: 99999,
      userTimeZone: 'UTC',
      loadContentCover: true
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
      const type = schemaDefinition.type
      let value = page.value.properties && page.value.properties[s] && page.value.properties[s][0][0]

      if(type === "checkbox") {
        value = value === "Yes" ? true : false
      } else if(value && type === "date") {
        try {
          value = page.value.properties[s][0][1][0][1]
        } catch {
          // it seems the older Notion date format is [[ string ]]
          value = page.value.properties[s][0][0]
        }
      } else if(value && type === "text") {
        value = textArrayToHtml(page.value.properties[s])
      } else if(value && type === "file") {
        const files = page.value.properties[s].filter(f => f.length > 1)
        // some items in the files array are for some reason just [","]

        const outputFiles = []

        files.forEach(file => {
          const s3Url = file[1][0][1]
          outputFiles.push(getAssetUrl(s3Url, page.value.id))
        })

        value = outputFiles
      } else if(value && type === "multi_select") {
        value = value.split(",")
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
