import { Body, Head } from '@core'
import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import helmet from 'react-helmet'
import ExampleMetaPage from './example/example_meta_page'
import ExamplePage from './example/example_page'

@suite('Unit::Core::Page')
class Test {
  @test
  async 'simple text response works'() {
    const examplePage = new ExamplePage({})
    expect(examplePage.path).to.be.equal('/demo')
    const content = renderToStaticMarkup(<ExamplePage />)
    expect(content).to.be.equal('<h1>Hello World</h1>')
  }

  @test
  async 'simple meta response works'() {
    const examplePage = new ExampleMetaPage({})
    expect(examplePage.path).to.be.equal('/')

    const content = renderToStaticMarkup(<ExampleMetaPage />)
    const html = renderToStaticMarkup(
      <html>
        <Head />
        <Body renderedContent={content}>
          <script src="/assets/bundle.js" />
        </Body>
      </html>
    )
    expect(content).to.be.equal('<h1>Hello World</h1>')
  }
}
