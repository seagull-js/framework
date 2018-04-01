import { Document, ReadOnlyConfig } from '@core'
import 'chai/register-should'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Helmet } from 'react-helmet'

@suite('Unit::Core::SPA::Document')
class Test {
  after() {
    delete process.env.config_mock
  }

  @test
  async 'simple document without anything works'() {
    process.env.config_mock = JSON.stringify({})
    const content = renderToStaticMarkup(<Document content={'here yo are'} />)
    content.should.contain('here yo are')
  }
  @test
  async 'simple document with ga and analytics works'() {
    ReadOnlyConfig.config.analytics = { ga: 'UA-23423', enabled: true }
    const content = renderToStaticMarkup(<Document content={'here yo are'} />)
    content.should.contain('UA-23423')
    content.should.contain('window.analytics')
  }
}
