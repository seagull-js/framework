import { FrontendIndex } from '@scaffold'
import * as chokidar from 'chokidar'
import * as cnm from 'copy-node-modules'
import * as fs from 'fs'
import { join, relative, resolve } from 'path'
import * as ts from 'typescript'
import { listFiles, transpileCode, transpileFile, transpileFolder } from './'

export class Compiler {
  /** directory names where code resides */
  codeFolders: string[] = ['backend', 'frontend']
  /** where to read files from */
  dstFolder: string
  /** where to write results to */
  srcFolder: string
  /** a parsed tsconfig file */
  tsConfig: object
  /** reference to a file watcher instance */
  watcher: chokidar.FSWatcher

  /** just sets up common settings like folder paths */
  constructor(srcFolder: string) {
    this.srcFolder = resolve(srcFolder)
    this.dstFolder = join(this.srcFolder, '.seagull', 'dist')
    this.loadTsConfig()
  }

  /** transpile complete [[srcFolder]] to [[dstFolder]] once */
  compile() {
    this.codeFolders.forEach(folder => this.compileCodeFolder(folder))
  }

  /** watch the [[srcFolder]] and transpile individual files on change */
  watch() {
    const folders = this.codeFolders.map(f => join(this.srcFolder, f))
    this.watcher = chokidar.watch(folders, { ignoreInitial: false })
    this.watcher.on('add', this.compileCodeFile)
    this.watcher.on('change', this.compileCodeFile)
    this.watcher.on('unlink', this.deleteFile)
  }

  stop() {
    this.watcher.close()
  }

  /**
   * Execute finishing touches before deployment, like copying node_modules,
   * bundling the frontend or generating serverless.yml file
   */
  async finalize() {
    this.copyPackageJson()
    this.createFrontendIndex()
    await this.copyNodeModules()
  }

  private compileCodeFolder(name: string): void {
    const from = resolve(join(this.srcFolder, name))
    const to = resolve(join(this.dstFolder, name))
    transpileFolder(from, to, this.tsConfig)
  }

  private compileCodeFile(path: string): void {
    const from = resolve(path)
    const fragment = relative(this.srcFolder, from).replace(/tsx?$/, 'js')
    const to = resolve(join(this.dstFolder, fragment))
    transpileFile(from, to, this.tsConfig)
  }

  private deleteFile(from: string): void {
    const to = resolve(relative(this.srcFolder, from)).replace(/tsx?$/, 'js')
    fs.unlinkSync(to)
  }

  private loadTsConfig() {
    const file = resolve(join(this.srcFolder, 'tsconfig.json'))
    const exists = fs.existsSync(file)
    const reader = path => fs.readFileSync(path, 'utf-8')
    this.tsConfig = exists ? ts.readConfigFile(file, reader) : null
  }

  private copyNodeModules() {
    const from = this.srcFolder
    const to = join(this.srcFolder, '.seagull')
    return new Promise(done => cnm(from, to, () => done()))
  }

  private copyPackageJson() {
    const from = join(this.srcFolder, 'package.json')
    const to = join(this.srcFolder, '.seagull', 'package.json')
    fs.writeFileSync(to, fs.readFileSync(from))
  }

  private createFrontendIndex() {
    const pagesRoot = join(this.dstFolder, 'frontend', 'pages')
    const files = listFiles(pagesRoot).map(f => relative(pagesRoot, f))
    const pages = files.map(f => './pages/' + f)
    const index = new FrontendIndex(pages).toString()
    const indexPath = join(this.dstFolder, 'frontend', 'index.js')
    transpileCode(index, indexPath)
  }
}
