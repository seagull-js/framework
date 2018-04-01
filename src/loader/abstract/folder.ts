/** @module Loader */
/**
 * A folder is a virtual abstraction over the a collection of things. In this
 * case, it holds a reference to a file system path pointing to a [[Directory]].
 */
export default class Folder {
  /**
   * the folder where the files are located
   */
  rootPath: string

  /**
   * Create a new instance by providing a folder path. Instancing  will populate
   * the [[filePaths]] property with the result of the [[listFiles]]
   * method using the [[rootPath]] as a parameter.
   *
   * @param rootPath absolute folder where to load files from
   */
  constructor(rootPath: string) {
    this.rootPath = rootPath
  }
}
