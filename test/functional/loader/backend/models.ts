import { Models } from '@loader'
import { Model } from '@scaffold'
import 'chai/register-should'
import * as fs from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import FunctionalTest from '../../../helper/functional_test'
import { transpileFolder } from '../../../helper/transpile'

@suite('Functional::Loader::Models')
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
    const models = new Models(rootPath)
    models.should.be.an('object')
    models.should.be.instanceOf(Models)
  }

  @test
  'does load all files as modules'() {
    const srcPath = './tmp/TS'
    fs.mkdirSync(srcPath)
    Model('Scampi', { fields: [] }).toFile(`${srcPath}/Scampi.ts`)
    const dstPath = './tmp/JS'
    transpileFolder(srcPath, dstPath)
    const models = new Models(dstPath)
    models.should.be.an('object')
    models.modules.should.be.an('array')
    models.modules.should.have.length(1)
    const { default: Scampi } = models.modules[0]
    Scampi.should.be.a('function')
  }

  @test
  'can transform modules to CloudFormation resources'() {
    const srcPath = './tmp/TS'
    fs.mkdirSync(srcPath)
    Model('Scampi', { fields: [] }).toFile(`${srcPath}/Scampi.ts`)
    const dstPath = './tmp/JS'
    transpileFolder(srcPath, dstPath)
    const models = new Models(dstPath)
    models.resources.should.be.be.an('object')
    models.resources.scampi.should.be.be.an('object')
    models.resources.scampi.Type.should.be.equal('AWS::DynamoDB::Table')
  }
}
