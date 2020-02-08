/* Returns reconstructed HTML for a given Notion doc */

const call = require("../notion/call")
const normalizeId = require("../notion/normalizeId")
const textArrayToHtml = require("../notion/textArrayToHtml.js")

module.exports = async (req, res) => {
  const { id:queryId } = req.query
  const id = normalizeId(queryId)

  if(!id) {
    return res.json({
      error: "no Notion doc ID provided as `id` parameter"
    })
  }

  const overview = await call("getRecordValues", {
    requests: [
      {
        id,
        table: "block"
      }
    ]
  })

  if(!overview.results[0].value) {
    return res.json({
      error: "could not read Notion doc with this ID - make sure public access is enabled"
    })
  }

  const contentIds = overview.results[0].value.content

  if(!contentIds) {
    return res.json({
      error: "cannot get content for this doc"
    })
  }

  const contents = []

  const chunk = await call("loadPageChunk", {
    pageId: id,
    limit: 999999,
    cursor: {
      stack: []
    },
    chunkNumber: 0,
    verticalColumns: false
  })

  contentIds.forEach(id => {
    const block = chunk.recordMap.block[id]
    if(block) contents.push(block.value)
  })

  const html = []

  contents.forEach(block => {
    const type = block.type

    if(["header", "sub_header", "sub_sub_header", "text"].includes(type)) {
      /* Headers (H1 - H3) and plain text */
      const el = {
        header: "h1",
        sub_header: "h2",
        sub_sub_header: "h3",
        text: "p"
      }[type]

      if(!block.properties) {
        // This is an empty text block. 
        return
      }

      html.push(`<${el}>${textArrayToHtml(block.properties.title)}</${el}>`)
    } else if(["numbered_list", "bulleted_list"].includes(type)) {
      /* Numbered and bulleted lists */
      const el = {
        "numbered_list": "ol",
        "bulleted_list": "ul"
      }[type]

      html.push(`<${el}><li>${textArrayToHtml(block.properties.title)}</li></${el}>`)
    } else if(["to_do"].includes(type)) {
      /* To do list represented by a list of checkbox inputs */
      const checked = Boolean(block.properties.checked)
      html.push(`<div class="checklist"><input type="checkbox" disabled${checked && " checked"}>${textArrayToHtml(block.properties.title)}</input></div>`)
    } else if(["code"].includes(type)) {
      /* Full code blocks with language */
      const language = block.properties.language[0][0].toLowerCase()
      const text = block.properties.title || [[""]]

      // Inject unescaped HTML if code block's language is set to LiveScript
      const showLive = language === "livescript"
      if(showLive) {
        html.push(text.map(clip => clip[0]).join("")) // Ignore styling, just take the text
      } else {
        html.push(`<pre><code class="language-${language}">${textArrayToHtml(text)}</code></pre>`)
      }
    } else if(["callout"].includes(type)) {
      /* Callout formatted with emoji from emojicdn.elk.sh */
      const emoji = block.format.page_icon
      const color = block.format.block_color.split("_")[0]
      const isBackground = block.format.block_color.split("_").length > 1
      const text = block.properties.title
      html.push(`<div class="callout${isBackground ? " background" : " color"}-${color}"><img src="https://emojicdn.elk.sh/${emoji}"><p>${textArrayToHtml(text)}</p></div>`)
    } else if(["quote"].includes(type)) {
      html.push(`<blockquote>${textArrayToHtml(block.properties.title)}</blockquote>`)
    } else if(["divider"].includes(type)) {
      html.push(`<hr>`)
    } else if(["image"].includes(type)) {
      html.push(`<img src="https://www.notion.so/image/${encodeURIComponent(block.format.display_source)}">`)
    } else {
      /* Catch blocks without handler method */
      console.log(`Unhandled block type "${block.type}"`, block)
    }
  })

  const joinedHtml = html.join("")
  const cleanedHtml = joinedHtml
                        .replace(/<\/ol><ol>/g, "")
                        .replace(/<\/ul><ul>/g, "")
                        .replace(/<\/div><div class="checklist">/g, "")
  res.send(cleanedHtml)
}