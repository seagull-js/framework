import * as fs from 'fs'
import { flatten } from 'lodash'
import * as ts from 'typescript'

/**
 * Directly transpiles a typescript source file to a javascript source file.
 * This will NOT actually parse modules, import things, and so on, so it can
 * be used in a fast way, ignoring _(missing)_ node_modules.
 *
 * @param from absolute path to the source file
 * @param to absolute path to the destination file
 * @param opts tsconfig settings
 */
export function transpileFile(from: string, to: string, opts?: any) {
  const sourceText = fs.readFileSync(from, 'utf-8')
  transpileCode(sourceText, to, opts)
}

/**
 * Transpile a given blob of typescript code directly to a javascript file.
 * Will append an additional export (besides `default`) called `dispatch` which
 * has a proper `this` bound to it. Neccessary for APIs on AWS Lambda invokes.
 *
 * @param sourceText the code as string representation
 * @param to absolute path to the destination file
 * @param opts tsconfig settings
 */
export function transpileCode(sourceText: string, to: string, opts?: any) {
  const module = ts.ModuleKind.CommonJS
  const target = ts.ScriptTarget.ES2015
  const compilerOptions = opts || { module, target }
  compilerOptions.jsx = ts.JsxEmit.React
  const { outputText } = ts.transpileModule(sourceText, { compilerOptions })
  const code = modifyApiCodeExports(outputText)
  write(to, code)
}

/**
 * Recursive transpilation of typescript files for a given folder. Files not
 * ending with `.ts` or `.tsx` are copied as-is.
 *
 * @param from absolute path to the source folder
 * @param to absolute path to the destination folder
 * @param opts tsconfig settings
 */
export function transpileFolder(from: string, to: string, opts?: any) {
  const srcList = listFiles(from)
  const rename = (file: string) => file.replace(from, to).replace(/tsx?$/, 'js')
  const tp = (file: string) => transpileFile(file, rename(file), opts)
  const cp = (file: string) => write(rename(file), fs.readFileSync(file))
  srcList.forEach((file: string) => (/tsx?$/.test(file) ? tp(file) : cp(file)))
}

// write a file and ensure all intermediate folders exist
function write(filePath: string, content: string | Buffer) {
  const fragments = filePath.split('/')
  fragments.pop()
  const folder = fragments.join('/')
  require('mkdirp').sync(folder)
  fs.writeFileSync(filePath, content)
}

// get a tree of files existing in the given source folder
function listFiles(cwd: string): string[] {
  if (fs.lstatSync(cwd).isFile()) {
    return [cwd]
  } else {
    const names = fs.readdirSync(cwd)
    const list = names.map(f => listFiles(`${cwd}/${f}`))
    return flatten(list)
  }
}

// modify the script exports for lambda usage
function modifyApiCodeExports(code: string): string {
  const isAPI = code.includes('extends framework_1.API')
  const matcher = /(exports.default = (\w+))/
  const replacer = '$1;\nexports.handler = $2.dispatch.bind($2)'
  return isAPI ? code.replace(matcher, replacer) : code
}
