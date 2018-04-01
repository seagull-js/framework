/** @module Scaffold */
import { Class } from './'

export interface IShrimpOptions {
  fields: Array<{
    name: string
    type: string
    initial: string
  }>
}

export function Shrimp(name: string, options: IShrimpOptions): Class {
  const gen = new Class(name, 'Shrimp')
  gen.addNamedImports('@seagull/core', ['field', 'Shrimp'])
  if (!options.fields || !options.fields.length) {
    return gen
  }
  for (const field of options.fields) {
    if (!field.name || !field.type || !field.initial) {
      continue
    }
    gen.addProp({
      decorators: [{ name: 'field' }],
      name: field.name,
      type: field.type,
      value: field.initial,
    })
  }
  return gen
}
