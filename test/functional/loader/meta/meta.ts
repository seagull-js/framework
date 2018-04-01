import { Meta } from '@loader'
import 'chai/register-should'
import * as fs from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import FunctionalTest from '../../../helper/functional_test'

@suite('Functional::Loader::Meta')
class Test extends FunctionalTest {
  before() {
    this.mockFolder('./tmp')
  }
  after() {
    this.restoreFolder()
  }

  @test
  'can be loaded with no app path given and sets itself to invalid'() {
    const meta = new Meta()
    meta.should.be.an('object')
    meta.isValid.should.be.equal(false)
  }

  @test
  'can be loaded with defaults'() {
    fs.writeFileSync('./tmp/package.json', JSON.stringify({ name: 'demo' }))
    const meta = new Meta('./tmp')
    meta.should.be.an('object')
    meta.isValid.should.be.equal(true)
    meta.account.should.be.an('object')
    meta.package.should.be.an('object')
  }
}
