import { Compiler } from '@compiler'
import { API, App } from '@scaffold'
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
    fs.mkdirSync(path.join('./tmp', 'backend'))
    fs.mkdirSync(path.join('./tmp', 'frontend'))
    API('Demo', {}).toFile(path.join('./tmp/backend/Demo.ts'))
    const compiler = new Compiler('./tmp')
    compiler.compile()
    const jsPath = path.join('./tmp/.seagull/dist/backend/Demo.js')
    const code = fs.readFileSync(jsPath, 'utf-8')
    code.should.be.a('string')
    code.should.contain('class Demo')
  }

  @test
  async 'can watch a source folder'() {
    fs.mkdirSync(path.join('./tmp', 'backend'))
    fs.mkdirSync(path.join('./tmp', 'frontend'))
    const compiler = new Compiler('./tmp')
    compiler.watch()
    API('Demo', {}).toFile(path.resolve('./tmp/backend/Demo.ts'))
    await sleep(100) // enough time for "nextTick" since compiling is synchronous
    const jsPath = path.resolve('./tmp/.seagull/dist/backend/Demo.js')
    const code = fs.readFileSync(jsPath, 'utf-8')
    code.should.be.a('string')
    code.should.contain('class Demo')
  }

  @test
  async 'can compile a complete app folder including TSX files'() {
    new App('demo', '0.0.1').toFolder(path.resolve('./tmp/demo'))
    const compiler = new Compiler('./tmp/demo')
    compiler.compile()
    const jsPath = './tmp/demo/.seagull/dist/frontend/pages/hello.js'
    const code = fs.readFileSync(path.resolve(jsPath), 'utf-8')
    code.should.be.a('string')
    code.should.contain('HelloPage')
    code.should.contain('React.createElement')
    const pagesPath = path.resolve('./tmp/demo/.seagull/dist/frontend/pages/')
    const files = fs.readdirSync(pagesPath)
    files.should.be.deep.equal(['hello.js'])
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
