import { Directory } from '@loader'
import 'chai/register-should'
import * as fs from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import FunctionalTest from '../../../helper/functional_test'

@suite('Functional::Loader::Directory')
class Test extends FunctionalTest {
  before() {
    this.mockFolder('./tmp')
  }
  after() {
    this.restoreFolder()
  }

  @test
  'can be instantiated'() {
    const rootPath = './tmp'
    const folder = new Directory(rootPath)
    folder.should.be.an('object')
    folder.should.be.instanceOf(Directory)
  }

  @test
  'does load all files within directory'() {
    const rootPath = './tmp'
    fs.writeFileSync(`${rootPath}/a.js`, `module.exports = {}`)
    fs.writeFileSync(`${rootPath}/b.js`, `module.exports = {}`)
    fs.writeFileSync(`${rootPath}/c.js`, `module.exports = {}`)
    const folder = new Directory(rootPath)
    folder.filePaths.should.be.an('array')
    folder.filePaths.length.should.be.equal(3)
    folder.filePaths[0].should.be.equal(`${rootPath}/a.js`)
  }
}
