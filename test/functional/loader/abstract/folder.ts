import { Folder } from '@loader'
import 'chai/register-should'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import FunctionalTest from '../../../helper/functional_test'

@suite('Folder')
class Test extends FunctionalTest {
  @test
  'can be instantiated'() {
    const rootPath = '/some/path'
    const folder = new Folder(rootPath)
    folder.should.be.an('object')
    folder.should.be.instanceOf(Folder)
  }

  @test
  'does store rootPath variable after instantiation'() {
    const rootPath = '/some/path'
    const folder = new Folder(rootPath)
    folder.rootPath.should.be.equal(rootPath)
  }
}
