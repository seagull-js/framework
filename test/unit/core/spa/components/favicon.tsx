import { Favicons } from '@core'
import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

@suite('Unit::Core::SPA::Favicon')
class Test {
  @test
  async 'simple favicons parameters works'() {
    const content = renderToStaticMarkup(
      <Favicons favicons={['apple-touch-icon-57x57.png']} />
    )
    // tslint:disable-next-line:no-unused-expression
    expect(content.indexOf('apple-touch-icon-57x57.png') > -1).to.be.true
    // tslint:disable-next-line:no-unused-expression
    expect(content.indexOf('apple-touch-icon-114x114.png') > -1).to.be.false
  }
}
