import { ApiRobots } from '@scaffold'
import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'

@suite('Unit::Scaffold::ApiRobots')
class Test {
  @test
  'can be initialized'() {
    const gen = ApiRobots()
    expect(gen).to.be.an('object')
  }

  @test
  'contains allow all directive by default'() {
    const gen = ApiRobots()
    const code = gen.toString()
    expect(code).to.contain('User-agent: *')
    expect(code).to.contain('Disallow:')
  }
}
