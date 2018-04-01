import { Request } from '@core'
import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import ExampleAPI from './example/Error'

@suite('Unit::Core::Api::Error')
class Test {
  @test
  async 'error response is correct'() {
    const api = new ExampleAPI()
    const request = new Request('GET', '/error', {})
    const response = await api.handle(request)
    expect(response.statusCode).to.be.equal(500)
    expect(response.body).to.be.equal('fail!')
  }
}
