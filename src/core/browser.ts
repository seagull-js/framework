/** @module Core */
// Suppressing warning
//  [mobx] Warning: there are multiple mobx instances active.
//  This might lead to unexpected results. See https://github.com/mobxjs/mobx/issues/1082 for details.
// by isolating state.
// We get the message during development because cli AND the project do import mobx from different sources.
// However - the cli does not use anything mobx related so turning this off should be safe.
import * as mobx from 'mobx'
mobx.extras.isolateGlobalState()

// Frontend building blocks
export { default as Routing } from './spa/routing'
export { default as Page } from './spa/page'
export { default as Favicons } from './spa/components/favicon'
export { default as Document } from './spa/components/document'
export { default as Meta } from './spa/components/meta'
export { default as Tracking } from './spa/tracking'

// Utility & Helpers
export { isClient, isServer, history } from './util'
