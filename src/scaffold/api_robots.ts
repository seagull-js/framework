/** @module Scaffold */
import { API, Class } from './'

export function ApiRobots(): Class {
  const body = `
    const txt = \`
      User-agent: *
      Disallow:
    \`
    return this.text(txt)
  `
  const opts = { path: '/robots.txt', method: 'GET', body }
  const gen = API('Frontent', opts)
  return gen
}
