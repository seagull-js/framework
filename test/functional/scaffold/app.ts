import { App } from '@scaffold'
import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import FunctionalTest from '../../helper/functional_test'

@suite('Functional::Scaffold::App')
class Test extends FunctionalTest {
  before() {
    this.mockFolder('./tmp')
  }
  after() {
    this.restoreFolder()
  }

  @test
  'can be initialized'() {
    const gen = new App('demo', '0.1.0')
    expect(gen).to.be.an('object')
  }

  @test
  'can be written to folder'() {
    const gen = new App('demo', '0.1.0')
    expect(gen).to.be.an('object')
    gen.toFolder('./tmp/demo')
  }
}
