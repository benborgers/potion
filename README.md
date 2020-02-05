# Potion

Potion is a reverse-engineered API for [Notion](https://notion.so). Write your content in Notion, and use Potion's simple hosted API endpoints to read your content. 

## Endpoints

All endpoints are relative to the base URL: `https://potion.benborgers.now.sh`

*`<notion-page-id>` refers to the 32 character alphanumeric string in the URL of a Notion doc (but not a query parameter, so not the string after `?v=`).*

### /api/table

Lists all entries in a full-page Notion table, along with additional details about each page. 

The only query parameter is `?id=<notion-page-id>`. 

### /api/html

Generates HTML for a given Notion page. You can insert it as the contents of a blog post, for example. 

The only query parameter is `?id=<notion-page-id>`, which can be obtained from the `/api/table` endpoint or just by copy-and-pasting from the URL

## Limitations

Most, but not all, of the common Notion blocks are supported at the moment:

- [x] Text
- [x] To-do List
- [x] Heading 1
- [x] Heading 2
- [x] Heading 3
- [x] Bulleted List
- [x] Numbered List
- [ ] Toggle List
- [x] Quote
- [x] Divider
- [ ] Link To Page
- [x] Callout
- [ ] Image
- [ ] Web Bookmark
- [ ] Video
- [ ] Audio
- [x] Code
- [ ] File