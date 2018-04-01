/** @module Loader */
import { PackageJson } from '../../settings'
import Account from './account'

/**
 * Represents metadata that isn't written in direct code files. Loads from
 * the app's package.json file or AWS services.
 */
export default class Meta {
  /**
   * precise [[Account]] metadata useful for deployment
   */
  account: Account

  /**
   * convenience check if everything could be loaded correctly. Check this
   * before you use things!
   */
  isValid: boolean = false

  /**
   * user-defined metadata and configuration from the project's package.json
   */
  package: PackageJson

  /**
   * Determine all metadata possible for convenient usage within the tooling
   *
   * @param rootPath path to the app folder
   */
  constructor(rootPath = process.cwd()) {
    try {
      this.account = new Account()
      this.package = new PackageJson(`${rootPath}/package.json`)
      this.isValid = true
    } catch (error) {
      this.isValid = false
    }
  }
}
