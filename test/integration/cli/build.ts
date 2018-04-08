import 'chai/register-should'
import * as fs from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join, resolve } from 'path'
import * as rfs from 'require-from-string'
import BuildCommand from '../../../src/cli/commands/build'
import IntegrationTest from '../../helper/integration_test'

@suite('Integration::Commands::build')
class Test extends IntegrationTest {
  static before = () => Test.createApp()
  static after = () => Test.clearApp()

  @test
  async 'can build a project'() {
    const files = fs.readdirSync(this.appDir())
    files.should.contain('backend')
    files.should.contain('frontend')
    files.should.contain('package.json')
    files.should.contain('tsconfig.json')
    files.should.contain('tslint.json')
    await new BuildCommand().execute()
    const sgPath = join(this.appDir(), '.seagull')
    fs.readdirSync(sgPath).should.be.deep.equal(['dist', 'package.json'])
    const frontendPath = join(sgPath, 'dist', 'frontend')
    fs.readdirSync(frontendPath).should.be.deep.equal(['index.js', 'pages'])
  }

  @test
  'creates hidden subfolder in project'() {
    const folder = join(this.appDir(), '.seagull')
    fs.existsSync(folder).should.be.equal(true)
  }

  @test.skip
  'creates serverless.yml in subfolder'() {
    const file = join(this.appDir(), '.seagull', 'serverless.yml')
    fs.existsSync(file).should.be.equal(true)
    const text = fs.readFileSync(file, { encoding: 'utf-8' })
    text.should.include(this.appName)
  }

  @test
  'subfolder contains package.json file'() {
    const file = join(this.appDir(), '.seagull', 'package.json')
    fs.existsSync(file).should.be.equal(true)
    const text = fs.readFileSync(file, { encoding: 'utf-8' })
    text.should.include(this.appName)
    const json = JSON.parse(text)
    json.name.should.be.equal(this.appName)
    json.version.should.be.equal('0.1.0')
  }

  @test
  'subfolder contains dist folder'() {
    const folder = join(this.appDir(), '.seagull', 'dist')
    fs.existsSync(folder).should.be.equal(true)
  }

  @test
  'api handler exports get rewritten'() {
    const dstPath = join(this.appDir(), '.seagull', 'dist')
    const apiPath = join(dstPath, 'backend', 'api', 'Frontend.js')
    const code = fs.readFileSync(apiPath, 'utf-8')
    const api = rfs(code)
    api.default.should.be.a('function')
    api.handler.should.be.a('function')
  }

  // @test
  // 'frontend gets browserified into a single file'() {
  //   const file = join(this.appDir, '.seagull', 'assets', 'bundle.js')
  //   expect(existsSync(file)).to.be.equal(true)
  // }

  // @test
  // 'assets get copied'() {
  //   const file = join(this.appDir, '.seagull', 'assets', 'seagull-logo.png')
  //   expect(existsSync(file)).to.be.equal(true)
  // }

  @test
  'index file for store/page imports got created'() {
    const file = join(this.appDir(), '.seagull', 'dist', 'frontend', 'index.js')
    fs.existsSync(file).should.be.equal(true)
  }

  // @test
  // 'robots txt handler gets exported'() {
  //   const file = join(
  //     this.appDir,
  //     '.seagull',
  //     'dist',
  //     'backend',
  //     'api',
  //     'RobotsTxt.js'
  //   )
  //   expect(existsSync(file)).to.be.equal(true)
  // }

  @test
  'check that index file for store/page can be imported'() {
    const dstPath = join(this.appDir(), '.seagull', 'dist')
    const indexPath = join(dstPath, 'frontend', 'index.js')
    delete require.cache[indexPath]
    const index = require(indexPath)
    index.should.be.an('object')
    index.stores.should.be.an('array')
    index.stores.should.have.length(0)
    index.pages.should.be.an('array')
    index.pages.should.have.length(1)
  }

  // @test
  // 'shrimp gets exported'() {
  //   const file = join(
  //     this.appDir,
  //     '.seagull',
  //     'dist',
  //     'backend',
  //     'shrimps',
  //     'Scampi.js'
  //   )
  //   expect(existsSync(file)).to.be.equal(true)
  // }
}
