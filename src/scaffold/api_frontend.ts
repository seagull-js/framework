/** @module Scaffold */
import { API, Class } from './'

export function ApiFrontend(): Class {
  const body = `
    const appRouter = new Routing(true, request)
    const page = appRouter.initialMatchedPage()
    if (page && typeof page.componentDidMount === 'function'){
      await page.componentDidMount()
    }
    const content = renderToString(appRouter.load())
    const html = renderToString(Document({content}))
    return this.html(html)
  `
  const opts = { path: '/*', method: 'GET', body }
  const gen = API('Frontent', opts)
  gen.addNamedImports('@seagull/framework', ['Routing', 'Document'])
  gen.addNamedImports('react-dom/server', ['renderToString'])
  gen.addNamedImports('typestyle', ['getStyles'])
  return gen
}
