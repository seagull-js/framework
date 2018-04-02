import { transpileFolder } from '@compiler'
import { Shrimps } from '@loader'
import { Shrimp } from '@scaffold'
import 'chai/register-should'
import * as fs from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import FunctionalTest from '../../../helper/functional_test'

@suite('Functional::Loader::Shrimps')
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
    const shrimps = new Shrimps(rootPath)
    shrimps.should.be.an('object')
    shrimps.should.be.instanceOf(Shrimps)
  }

  @test
  'does load all files as modules'() {
    const srcPath = './tmp/TS'
    fs.mkdirSync(srcPath)
    Shrimp('Scampi', { fields: [] }).toFile(`${srcPath}/Scampi.ts`)
    const dstPath = './tmp/JS'
    transpileFolder(srcPath, dstPath)
    const shrimps = new Shrimps(dstPath)
    shrimps.should.be.an('object')
    shrimps.modules.should.be.an('array')
    shrimps.modules.should.have.length(1)
    const { default: Scampi } = shrimps.modules[0]
    Scampi.should.be.a('function')
  }

  @test
  'can transform modules to CloudFormation resources'() {
    const srcPath = './tmp/TS'
    fs.mkdirSync(srcPath)
    Shrimp('Scampi', { fields: [] }).toFile(`${srcPath}/Scampi.ts`)
    const dstPath = './tmp/JS'
    transpileFolder(srcPath, dstPath)
    const shrimps = new Shrimps(dstPath)
    shrimps.resources.should.be.be.an('object')
    const Scampi = shrimps.resources.Scampi
    const Properties = { Description: 'Seagull Shrimp' }
    Scampi.should.be.deep.equal({ Type: 'AWS::SDB::Domain', Properties })
  }
}
