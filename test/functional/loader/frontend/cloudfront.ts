import { CloudFront } from '@loader'
import 'chai/register-should'
import * as fs from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import FunctionalTest from '../../../helper/functional_test'

@suite('Assets')
class Test extends FunctionalTest {
  @test
  'can be instantiated'() {
    const cf = new CloudFront('demoApp', '1234', ['example.com'])
    cf.should.be.an('object')
  }

  @test
  'can transform into resources template object'() {
    const cf = new CloudFront('demoApp', '1234', ['example.com'])
    cf.resources.should.be.an('object')
  }
}
