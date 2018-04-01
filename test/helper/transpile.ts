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
 */
export function transpileFile(from: string, to: string) {
  const sourceText = fs.readFileSync(from, 'utf-8')
  const module = ts.ModuleKind.CommonJS
  const target = ts.ScriptTarget.ES2015
  const compilerOptions = { module, target }
  const result = ts.transpileModule(sourceText, { compilerOptions })
  write(to, result.outputText)
}

/**
 * Recursive transpilation of typescript files for a given folder. Files not
 * ending with `.ts` or `.tsx` are copied as-is.
 *
 * @param from absolute path to the source folder
 * @param to absolute path to the destination folder
 */
export function transpileFolder(from: string, to: string) {
  const srcList = listFiles(from)
  const rename = (file: string) => file.replace(from, to).replace(/tsx?$/, 'js')
  const tp = (file: string) => transpileFile(file, rename(file))
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
