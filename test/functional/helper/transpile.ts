import { API, App } from '@scaffold'
import 'chai/register-should'
import { readFileSync as read } from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import * as rfs from 'require-from-string'
import Test from '../../helper/functional_test'
import { transpileFile, transpileFolder } from '../../helper/transpile'

@suite('Transpile')
class FunctionalTest extends Test {
  before() {
    // fill the initial require cache before mocking FS
    this.mockRequire()
    require('react-dom/server')
    this.mockFolder('./tmp')
  }
  after() {
    this.restoreFolder()
  }

  @test
  'can transpile single file'() {
    const srcPath = './tmp/api.ts'
    const dstPath = './tmp/api.js'
    API('Demo', {}).toFile(srcPath)
    transpileFile(srcPath, dstPath)
    const file = read(dstPath, 'utf-8')
    file.should.contain('Demo')
    const api = rfs(file)
    api.default.should.be.a('function')
  }

  @test
  'can be written to folder'() {
    const srcPath = './tmp/demoTS'
    const dstPath = './tmp/demoJS'
    new App('demo', '0.1.0').toFolder(srcPath)
    transpileFolder(srcPath, dstPath)
    const apiPath = join(dstPath, 'backend', 'api', 'Frontend.js')
    const api = rfs(read(apiPath, 'utf-8'))
    api.default.should.be.a('function')
    const pagePath = join(dstPath, 'frontend', 'pages', 'hello.js')
    const page = rfs(read(apiPath, 'utf-8'))
    page.default.should.be.a('function')
  }
}
