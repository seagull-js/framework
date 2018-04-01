/** @module Scaffold */
import { join } from 'path'
import { Json } from './'

const tpl = `
{
  "compilerOptions": {
    "baseUrl": "./src/",
    "paths": {
      "@lib": ["./"]
    },
    "module": "commonjs",
    "skipLibCheck": true,
    "target": "es6",
    "noImplicitAny": false,
    "removeComments": true,
    "preserveConstEnums": true,
    "sourceMap": true,
    "declaration": true,
    "outDir": "./dist",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "lib": ["esnext"],
    "jsx": "react"
  },
  "include": ["src/**/*", "test/**/*"],
  "types": ["node"],
  "typeRoots": ["node_modules/@types"]
}
`

export function JsonTsconfig(): Json {
  const gen = new Json()
  // load from Template
  gen.fromString(tpl)
  // modify for folder structure specifics
  gen.update('compilerOptions', opts => {
    opts.rootDir = './'
    opts.outDir = './.seagull/dist'
  })
  // ambient settings
  gen.set('lib', ['es5', 'es6', 'es7', 'dom', 'dom.iterable'])
  gen.set('include', [
    'backend/**/*',
    'frontend/**/*',
    'models/**/*',
    'test/**/*',
  ])

  return gen
}
