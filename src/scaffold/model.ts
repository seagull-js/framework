/** @module Scaffold */

import { Class } from './'

export interface IModelOptions {
  fields: Array<{
    name: string
    type: string
    initial: string
  }>
}

export function Model(name: string, options: IModelOptions): Class {
  const gen = new Class(name, 'Model')
  gen.addNamedImports('@seagull/framework', ['field', 'Model'])
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
