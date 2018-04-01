import { Backend } from '@loader'
import { API, Shrimp } from '@scaffold'
import 'chai/register-should'
import * as fs from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import FunctionalTest from '../../../helper/functional_test'
import { transpileFolder } from '../../../helper/transpile'

@suite('Functional::Loader::Backend')
class Test extends FunctionalTest {
  before() {
    this.mockRequire()
    this.mockFolder('./tmp')
  }

  after() {
    this.restoreFolder()
  }

  @test
  'can be instantiated'() {
    const rootPath = '/some/path'
    const backend = new Backend(rootPath)
    backend.should.be.an('object')
    backend.should.be.instanceOf(Backend)
  }

  @test
  'does store rootPath variable after instantiation'() {
    const rootPath = '/some/path'
    const backend = new Backend(rootPath)
    backend.rootPath.should.be.equal(rootPath)
  }

  @test
  'has child components'() {
    const backend = new Backend('/some/path')
    backend.apis.should.be.an('object')
    backend.models.should.be.an('object')
    backend.shrimps.should.be.an('object')
  }

  @test
  'can create serverless/cloudformation template data'() {
    const srcPath = './tmp/TS'
    fs.mkdirSync(srcPath)
    fs.mkdirSync(srcPath + '/api')
    fs.mkdirSync(srcPath + '/shrimps')
    API('Aviate', {}).toFile(`${srcPath}/api/Aviate.ts`)
    Shrimp('Scampi', { fields: [] }).toFile(`${srcPath}/shrimps/Scampi.ts`)
    const dstPath = './tmp/JS'
    transpileFolder(srcPath, dstPath)
    const backend = new Backend(dstPath)
    const sls = backend.serverlessTemplate
    sls.functions.should.be.an('object')
    sls.functions['api-Aviate'].should.be.an('object')
    sls.resources.should.be.an('object')
    sls.resources.Resources.should.be.an('object')
    sls.resources.Resources.Scampi.should.be.an('object')
  }
}
