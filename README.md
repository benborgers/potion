# Potion

Potion is a reverse-engineered API for [Notion](https://notion.so). Write your content in Notion, and use Potion's hosted API endpoints to read your content.

If you have any questions about using Potion in your project, I'd love to help. Send me an email: benborgers@hey.com

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fbenborgers%2Fpotion)

## Guides

I've written a couple of blog posts on my website for using this API.

* [How to use Notion as your blog's CMS](https://benborgers.com/blog/notion-blog)
* [API to read a Notion table](https://benborgers.com/blog/notion-table)
* [How to turn a Notion doc into a website](https://benborgers.com/blog/notion-to-website)

## Endpoints

All endpoints are relative to the base URL: `https://potion-api.now.sh`

Responses are cached for 10 seconds, so it'll take up to 10 seconds for changes made in Notion to show up.

*`<notion-page-id>` refers to the 32 character alphanumeric string in the URL of a Notion doc (but not a query parameter, so not the string after `?v=`).*

### /table

Lists all entries in a full-page Notion table, along with additional details about each page.

The only query parameter is `?id=<notion-page-id>`.

### /table-description

Generates HTML for the description of a table.

The only query parameter is `?id=<notion-page-id>`.

### /html

Generates HTML for a given Notion page. You can insert it as the contents of a blog post, for example.

The only query parameter is `?id=<notion-page-id>`, which can be obtained from the `/table` endpoint or just by copy-and-pasting from the URL.

## Syntax Highlighting

Potion gives you syntax highlighting of Notion code blocks for free, when using the `/html` endpoint!

### How to use syntax highlighting

You'll notice that the code block HTML that Potion returns is given CSS classes that make it compatible with [Prism.js](https://prismjs.com/).

1. Pick a theme you like from [this README](https://github.com/PrismJS/prism-themes/blob/master/README.md).
2. Select the CSS file for that theme [from this list](https://unpkg.com/browse/prism-themes@latest/themes/) and click **View Raw**.
3. Include that stylesheet in the `head` of your HTML page to activate syntax highlighting. For example:
  ```html
  <link rel="stylesheet" href="https://unpkg.com/prism-themes@1.4.0/themes/prism-ghcolors.css" />
  ```

### Language support

Potion supports syntax highlighting for most popular languages, and you can open an issue if you'd like to see a language supported that isn't currently.


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
- [ ] Link to Page
- [x] Callout
- [x] Image
- [x] Embed
- [ ] Web Bookmark
- [x] Video
- [ ] Audio
- [x] Code
- [ ] File
- [x] Math Equation
- [x] Inline Equation

## Development and Deployment

This project is built to be deployed on [Vercel](https://vercel.com/home).

For local development, install [Vercel's CLI](https://vercel.com/download) and run `vercel dev`.
