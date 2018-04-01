import { Apis } from '@loader'
import { API } from '@scaffold'
import 'chai/register-should'
import * as fs from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import FunctionalTest from '../../../helper/functional_test'
import { transpileFolder } from '../../../helper/transpile'

@suite('Functional::Loader::Apis')
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
    const rootPath = './tmp'
    const apis = new Apis(rootPath)
    apis.should.be.an('object')
    apis.should.be.instanceOf(Apis)
  }

  @test
  'does load all files as modules'() {
    const srcPath = './tmp/TS'
    fs.mkdirSync(srcPath)
    API('Aviate', {}).toFile(`${srcPath}/Aviate.ts`)
    const dstPath = './tmp/JS'
    transpileFolder(srcPath, dstPath)
    const apis = new Apis(dstPath)
    apis.should.be.an('object')
    apis.modules.should.be.an('array')
    apis.modules.should.have.length(1)
    const { default: Api } = apis.modules[0]
    Api.should.be.a('function')
  }

  @test
  'can transform modules to Serverless CloudFormation functions'() {
    const srcPath = './tmp/TS'
    fs.mkdirSync(srcPath)
    const opts = { method: 'GET', path: '/aviate' }
    API('Aviate', opts).toFile(`${srcPath}/Aviate.ts`)
    const dstPath = './tmp/JS/api'
    transpileFolder(srcPath, dstPath)
    const apis = new Apis(dstPath)
    apis.functions.should.be.be.an('object')
    const Aviate = apis.functions['api-Aviate']
    Aviate.timeout.should.be.equal(30)
    Aviate.handler.should.be.equal('dist/backend/api/api-Aviate.handler')
    Aviate.events[0].http.method.should.be.equal('GET')
    Aviate.events[0].http.path.should.be.equal('/aviate')
  }

  @test
  'does handle special wildcard syntax'() {
    const srcPath = './tmp/TS'
    fs.mkdirSync(srcPath)
    const opts = { method: 'GET', path: '/*' }
    API('Aviate', opts).toFile(`${srcPath}/Aviate.ts`)
    const dstPath = './tmp/JS/api'
    transpileFolder(srcPath, dstPath)
    const apis = new Apis(dstPath)
    const Aviate = apis.functions['api-Aviate']
    Aviate.events[0].http.method.should.be.equal('GET')
    Aviate.events[0].http.path.should.be.equal('/')
    Aviate.events[1].http.method.should.be.equal('GET')
    Aviate.events[1].http.path.should.be.equal('/{proxy+}')
  }
}
