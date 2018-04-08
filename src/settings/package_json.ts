/** @module Settings */

import { noop } from 'lodash'
import { Config } from './config'

export interface IPackageJson {
  seagull: Config
}

export class PackageJson {
  /**
   * Seagull-specific configuration
   */
  config: Config

  /**
   * Your app name
   */
  name: string

  constructor(private path?: string) {
    this.loadFromFile()
  }

  /**
   * Add a domain to your app, will be integrated into cloudfront
   *
   * @param domain your domain name, like 'example.com
   */
  addDomain(domain: string): void {
    this.config.addDomain(domain)
    this.save()
  }

  /**
   * enable google analytics tracking and save setting to package.json
   *
   * @param gaCode ID of your google analytics property, like: 'UA-XXXXXX'
   */
  enableAnalytics(gaCode: string): void {
    this.config.enableAnalytics(gaCode)
    this.save()
  }

  /**
   * save all changes from this.config to package file
   */
  private save(): void {
    const pkg = JSON.parse(require('fs').readFileSync(this.path, 'utf-8'))
    pkg.seagull = this.config
    require('fs').writeFileSync(this.path, JSON.stringify(pkg, null, 2))
  }

  // load an actual file
  private loadFromFile() {
    !this.path ? (this.path = `${process.cwd()}/package.json`) : noop()
    const cfg = new Config()
    const file = require('fs').readFileSync(this.path, 'utf-8')
    const { name, seagull } = JSON.parse(file)
    this.name = name
    this.config = Object.assign(cfg, seagull)
  }
}
