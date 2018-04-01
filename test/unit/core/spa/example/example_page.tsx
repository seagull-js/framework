import { Page } from '@core'
import * as React from 'react'

/**
 * This is a comment text for visual comparison.
 */
export default class ExamplePage extends Page<{}, {}> {
  path = '/demo'

  render() {
    return <h1>Hello World</h1>
  }
}
