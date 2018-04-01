import { App } from '@loader'
import { App as AppGenerator } from '@scaffold'
import 'chai/register-should'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import FunctionalTest from '../../helper/functional_test'

@suite('Functional::Loader::App')
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
    const appPath = `./tmp/demo`
    new AppGenerator('demo', '0.1.0').toFolder(appPath)
    const app = new App(appPath)
    app.should.be.an('object')
    app.should.be.instanceOf(App)
    app.backend.should.be.an('object')
    app.frontend.should.be.an('object')
    app.meta.should.be.an('object')
  }
}
