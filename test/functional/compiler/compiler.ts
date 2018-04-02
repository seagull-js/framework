import { Compiler } from '@compiler'
import { API, App, Page } from '@scaffold'
import 'chai/register-should'
import * as fs from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import * as path from 'path'
import FunctionalTest from '../../helper/functional_test'

const sleep = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))

@suite('Functional::Compiler::Compiler')
class Test extends FunctionalTest {
  before() {
    this.mockFolder(path.resolve('./tmp'))
  }

  after() {
    this.restoreFolder()
  }

  @test
  'can be instantiated'() {
    const compiler = new Compiler('./tmp')
    compiler.should.be.an('object')
    compiler.should.be.instanceOf(Compiler)
  }

  @test
  'can compile a source folder'() {
    fs.mkdirSync(path.resolve(path.join('./tmp', 'backend')))
    fs.mkdirSync(path.join('./tmp', 'frontend'))
    API('Demo', {}).toFile(path.join('./tmp/backend/Demo.ts'))
    const compiler = new Compiler('./tmp')
    compiler.compile()
    const jsPath = path.join('./tmp/.seagull/dist/backend/Demo.js')
    const code = fs.readFileSync(jsPath, 'utf-8')
    code.should.be.a('string')
    code.should.contain('class Demo')
    code.should.contain('Demo.dispatch.bind(Demo)') // black magic!
  }

  // chokidar seems to have an issue while running in async mode on ts-node
  @test.skip
  async 'can watch a source folder including TSX files'() {
    fs.mkdirSync(path.resolve(path.join('./tmp', 'backend')))
    fs.mkdirSync(path.resolve(path.join('./tmp', 'frontend')))
    fs.mkdirSync(path.resolve(path.join('./tmp', 'frontend', 'pages')))
    const compiler = new Compiler('./tmp')
    compiler.watch()
    await sleep(10)
    const api = API('Demo', {})
    api.toFile(path.resolve('./tmp/backend/Demo.ts'))
    const page = Page('Hello', { path: '/' })
    page.toFile(path.resolve('./tmp/frontend/pages/Hello.ts'))
    await sleep(100) // enough time for "nextTick" since compiling is synchronous
    compiler.stop()
    const apiPath = path.resolve('./tmp/.seagull/dist/backend/Demo.js')
    const apiCode = fs.readFileSync(apiPath, 'utf-8')
    apiCode.should.be.a('string')
    apiCode.should.contain('class Demo')
    const pagePath = './tmp/.seagull/dist/frontend/pages/Hello.js'
    const pageCode = fs.readFileSync(path.resolve(pagePath), 'utf-8')
    pageCode.should.be.a('string')
    pageCode.should.contain('Hello')
    pageCode.should.contain('React.createElement')
  }

  @test
  async 'can finalize a project with deps, config & bundling'() {
    new App('demo', '0.0.1').toFolder(path.resolve('./tmp/demo'))
    const compiler = new Compiler('./tmp/demo')
    compiler.compile()
    await compiler.finalize()
    const files = fs.readdirSync('./tmp/demo/.seagull')
    files.should.be.deep.equal(['dist', 'node_modules', 'package.json'])
    // TODO: serverless.yaml
    // TODO: bundle.js
  }
}
