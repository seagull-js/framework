import { Frontend } from '@loader'
import 'chai/register-should'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import FunctionalTest from '../../../helper/functional_test'

@suite('Frontend')
class Test extends FunctionalTest {
  @test
  'can be instantiated'() {
    const rootPath = '/some/path'
    const frontend = new Frontend(rootPath)
    frontend.should.be.an('object')
    frontend.should.be.instanceOf(Frontend)
  }

  @test
  'does store rootPath variable after instantiation'() {
    const rootPath = '/some/path'
    const frontend = new Frontend(rootPath)
    frontend.rootPath.should.be.equal(rootPath)
  }
}
