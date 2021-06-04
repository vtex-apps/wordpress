import jsdom from 'jsdom'

const { JSDOM } = jsdom

const addCSShandles = (content: string) => {
  // A cached version of content may already contain the CSS handles
  if (content.includes('vtex-wordpress-integration')) {
    return content
  }

  // JSDOM requires a complete HTML document; content is partial HMTL
  const dom = new JSDOM(`<!DOCTYPE html><html><body>${content}</body></html>`)

  const { document } = dom.window
  const elements = document.querySelectorAll('*')

  for (const element of elements) {
    if (element.tagName === 'A') {
      element.classList.add('wordpressContentLink')
    }

    const classes = element.classList

    for (const item of classes) {
      element.classList.replace(item, `vtex-wordpress-integration-2-x-${item}`)
    }
  }

  return document.body.innerHTML
}

export default addCSShandles
