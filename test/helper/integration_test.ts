import { App as GenApp } from '@scaffold'
import * as fs from 'fs'
import * as mockRequire from 'mock-require'
import * as rimraf from 'rimraf'
import BaseTest from './base_test'

export default class IntegrationTest extends BaseTest {
  /** create an app called 'demo' and chdir into it ('./__tmp__/demo') */
  static createApp() {
    mockRequire('@seagull/framework', '../../src/core/index')
    fs.mkdirSync(`${process.cwd()}/__tmp__`)
    new GenApp('demo', '0.0.1').toFolder('__tmp__/demo')
    process.chdir('__tmp__/demo')
  }

  /** remove an app created by [[createApp]] and restore process.cwd() */
  static clearApp() {
    process.chdir('../..')
    rimraf.sync('__tmp__')
  }

  /** hardcoded name of the generated example app */
  appName = 'demo'

  /** hardcoded path of the generated example app */
  appDir = () => process.cwd()
}
