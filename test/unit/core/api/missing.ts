import { Request } from '@core'
import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import ExampleAPI from './example/NotFound'

@suite('Unit::Core::Api::Missing')
class Test {
  @test
  async 'missing response is correct'() {
    const api = new ExampleAPI()
    const request = new Request('GET', '/missing', {})
    const response = await api.handle(request)
    expect(response.statusCode).to.be.equal(404)
    expect(response.body).to.be.equal('nope!')
  }
}
