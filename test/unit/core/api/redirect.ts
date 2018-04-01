import { Request } from '@core'
import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import ExampleAPI from './example/Redirect'

@suite('Unit::Core::Api::Redirect')
class Test {
  @test
  async 'redirect response is correct'() {
    const api = new ExampleAPI()
    const request = new Request('GET', '/redirect', {})
    const response = await api.handle(request)
    expect(response.statusCode).to.be.equal(301)
    expect(response.headers.Location).to.be.equal('/example')
    expect(response.body).to.be.include('moved')
    expect(response.body).to.be.include('/example')
  }
}
