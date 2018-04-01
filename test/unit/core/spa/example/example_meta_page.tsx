import { Page } from '@core'
import * as React from 'react'
import { Helmet } from 'react-helmet'

export default class ExamplePage extends Page<{}, {}> {
  path = '/'

  render() {
    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>My Title</title>
          <link rel="canonical" href="http://mysite.com/example" />
        </Helmet>
        <h1>Hello World</h1>
      </>
    )
  }
}
