/** @module Scaffold */
import { join } from 'path'
import { Json } from './'

const tpl = `
{
  "defaultSeverity": "error",
  "extends": ["tslint:recommended", "tslint-config-prettier"],
  "jsRules": {},
  "rules": {
    "quotemark": [true, "single", "avoid-escape"],
    "member-access": [true, "no-public"]
  },
  "rulesDirectory": []
}
`

export function JsonTslint(): Json {
  const gen = new Json()
  // load from Template
  gen.fromString(tpl)
  return gen
}
