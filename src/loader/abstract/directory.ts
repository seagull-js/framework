/** @module Loader */
import * as fs from 'fs'
import { flatten } from 'lodash'
import * as requireFromString from 'require-from-string'
import Folder from './folder'

/**
 * A [[Directory]] is the physical representation of a grouped list of files.
 * While a [[Folder]] is a virtual abstraction, the [[Directory]] __does__ load
 * all files located at the path into memory.
 */
export default class Directory extends Folder {
  /**
   * array of files (absolute paths) inside the given rootPath
   */
  filePaths: string[] = []

  /**
   * array of modules, 1:1 mapped to the [[filePaths]] compiled from source
   */
  modules: any[] = []

  /**
   * Create a new instance by providing a folder path.
   *
   * Will populate the [[filePaths]] property with the result of the
   * [[listFiles]] method using the [[rootPath]] as a parameter.
   *
   * @param rootPath absolute folder where to load files from
   */
  constructor(rootPath: string) {
    super(rootPath)
    if (rootPath && fs.existsSync(rootPath)) {
      this.filePaths = this.listFiles(this.rootPath)
      this.modules = this.filePaths.map(path => this.loadModule(path))
    }
  }

  /**
   * Convenience method for loading files recursively from a folder. Returns
   * an array of file paths as strings. Will be called from the constructor
   * with the pre-filled [[rootPath]].
   *
   * @param cwd the absolute path where to search for files from
   */
  listFiles(cwd: string): string[] {
    if (fs.lstatSync(cwd).isFile()) {
      return cwd.endsWith('.js') ? [cwd] : []
    } else {
      const names = fs.readdirSync(cwd)
      const list = names.map(f => this.listFiles(`${cwd}/${f}`))
      return flatten(list)
    }
  }

  /**
   * Read and compile a javascript module directly. Is NOT cached and does NOT
   * use the native 'require' naively. This should work even when mocked.
   *
   * @param filePath
   */
  loadModule(filePath: string): any {
    return requireFromString(fs.readFileSync(filePath, 'utf-8'))
  }
}
