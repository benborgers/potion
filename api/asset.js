/* Get signed asset URL for Notion S3 files */

const call = require("../notion/call")

module.exports = async (req, res) => {
  const { url, blockId } = req.query

  if(!url) {
    return res.json({
      error: "No asset URL provided."
    })
  }

  if(!blockId) {
    return res.json({
      error: "No block ID provided."
    })
  }

  const assetRes = await call("getSignedFileUrls", {
    urls: [
      {
        url,
        permissionRecord: {
          table: "block",
          id: blockId
        }
      }
    ]
  })

  
  res.status(307)
  res.setHeader("location", assetRes.signedUrls[0])
  res.end()
}